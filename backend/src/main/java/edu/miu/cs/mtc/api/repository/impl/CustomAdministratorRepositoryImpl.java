package edu.miu.cs.mtc.api.repository.impl;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.aggregation.UnsetOperation.unset;

import edu.miu.cs.mtc.api.model.entity.Administrator;
import edu.miu.cs.mtc.api.repository.CustomAdministratorRepository;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomAdministratorRepositoryImpl implements CustomAdministratorRepository {
  private static final String COLLECTION_NAME = "administrators";
  private static final String TOTAL_FIELD_NAME = "total";

  private final MongoTemplate mongoTemplate;

  @SuppressWarnings("unchecked")
  @Override
  public Page<Administrator> findAllWithPagination(Pageable pageable) {
    AggregationOperation lookup = lookup("users", "user.$id", "_id", "userDetails");
    AggregationOperation unwind = unwind("userDetails");
    AggregationOperation match = match(Criteria.where("userDetails.roles").nin("SYSTEM_ADMIN"));
    AggregationOperation unset = unset("credentials");

    AggregationOperation skip = skip((long) pageable.getPageNumber() * pageable.getPageSize());
    AggregationOperation limit = limit(pageable.getPageSize());

    Aggregation countAggregation =
        newAggregation(lookup, unwind, match, unset, count().as(TOTAL_FIELD_NAME));

    Integer total =
        (Integer)
            Objects.requireNonNull(
                    mongoTemplate
                        .aggregate(countAggregation, COLLECTION_NAME, Map.class)
                        .getUniqueMappedResult())
                .getOrDefault(TOTAL_FIELD_NAME, 0);

    Aggregation aggregation = newAggregation(lookup, unwind, match, unset, skip, limit);
    AggregationResults<Administrator> results =
        mongoTemplate.aggregate(aggregation, COLLECTION_NAME, Administrator.class);

    return new PageImpl<>(results.getMappedResults(), pageable, total);
  }
}
