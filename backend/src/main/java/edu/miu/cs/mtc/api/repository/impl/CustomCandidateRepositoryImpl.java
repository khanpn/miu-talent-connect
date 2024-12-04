package edu.miu.cs.mtc.api.repository.impl;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

import edu.miu.cs.mtc.api.model.enums.CandidateProfileStatus;
import edu.miu.cs.mtc.api.model.search.CandidateSearch;
import edu.miu.cs.mtc.api.mongodb.AggregationPipelineLoader;
import edu.miu.cs.mtc.api.repository.CustomCandidateRepository;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@RepositoryRestResource(path = "candidateProfiles")
public class CustomCandidateRepositoryImpl implements CustomCandidateRepository {
  private static final String SEARCH_TERMS_PARAM_NAME = "searchTerms";
  private static final String PROFILE_STATUSES_PARAM_NAME = "profileStatuses";
  private static final String COLLECTION_NAME = "candidate_search_index";
  private static final String TOTAL_FIELD_NAME = "total";
  private static final String CATEGORIES_PARAM_NAME = "categories";
  private static final String SEARCH_PIPELINES_TEMPLATE =
      "mongodb/candidate-search-aggregation-pipelines/Search.json";
  private static final String MATCH_BY_PROFILE_STATUSES_PIPELINES_TEMPLATE =
      "mongodb/candidate-search-aggregation-pipelines/MatchByProfileStatuses.json";
  private static final String MATCH_BY_CATEGORIES_PIPELINES_TEMPLATE =
      "mongodb/candidate-search-aggregation-pipelines/MatchByCategories.json";

  private final AggregationPipelineLoader aggregationPipelineLoader;
  private final MongoTemplate mongoTemplate;

  @Value("${app.search.candidate.searchable-profile-statuses}")
  private Set<CandidateProfileStatus> searchableStatuses;

  @SuppressWarnings("unchecked")
  @Override
  public Page<CandidateSearch> findAllByCriteria(
      List<String> categories, List<String> searchTerms, Pageable pageable) {
    try {
      List<List<Document>> appliedPipelines = new ArrayList<>();
      HashMap<String, Object> params = new HashMap<>();
      if (searchTerms != null) {
        params.put(SEARCH_TERMS_PARAM_NAME, tokenizeParamValues(searchTerms));
        appliedPipelines.add(
            aggregationPipelineLoader.loadPipeline(SEARCH_PIPELINES_TEMPLATE, params));
      }
      params.put(PROFILE_STATUSES_PARAM_NAME, tokenizeParamValues(searchableStatuses));
      appliedPipelines.add(
          aggregationPipelineLoader.loadPipeline(
              MATCH_BY_PROFILE_STATUSES_PIPELINES_TEMPLATE, params));
      if (categories != null) {
        params.put(CATEGORIES_PARAM_NAME, tokenizeParamValues(categories));
        appliedPipelines.add(
            aggregationPipelineLoader.loadPipeline(MATCH_BY_CATEGORIES_PIPELINES_TEMPLATE, params));
      }

      AggregationOperation skip = skip((long) pageable.getPageNumber() * pageable.getPageSize());
      AggregationOperation limit = limit(pageable.getPageSize());

      List<AggregationOperation> operations =
          appliedPipelines.stream()
              .flatMap(Collection::stream)
              .map(doc -> (AggregationOperation) context -> doc)
              .collect(Collectors.toList());

      List<AggregationOperation> countOperation =
          appliedPipelines.stream()
              .flatMap(Collection::stream)
              .map(doc -> (AggregationOperation) context -> doc)
              .collect(Collectors.toList());
      countOperation.add(count().as(TOTAL_FIELD_NAME));

      Integer total =
          (Integer)
              Optional.ofNullable(
                      mongoTemplate
                          .aggregate(newAggregation(countOperation), COLLECTION_NAME, Map.class)
                          .getUniqueMappedResult())
                  .map(result -> result.get(TOTAL_FIELD_NAME))
                  .orElse(0);

      operations.add(skip);
      operations.add(limit);

      var results =
          mongoTemplate
              .aggregate(
                  Aggregation.newAggregation(operations), COLLECTION_NAME, CandidateSearch.class)
              .getMappedResults();

      return new PageImpl<>(results, pageable, total);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private String tokenizeParamValues(Iterable<?> iterable) {
    String tokens =
        StreamSupport.stream(iterable.spliterator(), false)
            .map(token -> "\"" + token + "\"")
            .collect(Collectors.joining(","));
    return "[" + tokens + "]";
  }
}
