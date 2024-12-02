package edu.miu.cs.mtc.api.service;

import edu.miu.cs.mtc.api.mongodb.AggregationPipelineLoader;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchDataSynchronizationService {
  private static final String SEARCH_DATA_SYNCHRONIZATION_PIPELINES_TEMPLATE =
      "mongodb/create-search-data/CandidateSearchDataSynchronization.json";
  private static final String COLLECTION_NAME = "candidates";
  private final AggregationPipelineLoader aggregationPipelineLoader;
  private final MongoTemplate mongoTemplate;

  @Scheduled(cron = "${app.search.candidate.data-synchronization-cron:0 0 * * * *}")
  public void synchronizeData() {
    try {

      List<Document> pipeline =
          aggregationPipelineLoader.loadPipeline(
              SEARCH_DATA_SYNCHRONIZATION_PIPELINES_TEMPLATE, null);
      List<AggregationOperation> operations =
          pipeline.stream().map(doc -> (AggregationOperation) context -> doc).toList();
      mongoTemplate.aggregate(
          Aggregation.newAggregation(operations), COLLECTION_NAME, Document.class);

    } catch (Exception e) {
      log.error("Cannot synchronize search data for searching candidates", e);
    }
  }
}
