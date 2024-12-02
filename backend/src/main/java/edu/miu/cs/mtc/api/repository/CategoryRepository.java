package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.model.entity.Category;
import edu.miu.cs.mtc.api.model.search.CategoryFilter;
import java.util.List;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
  @Aggregation(
      pipeline = {
        "{ $lookup: { from: 'candidate_profiles', localField: 'name', foreignField:"
            + " 'primaryTechnologies', as: 'profiles' } }",
        "{ $addFields: { candidateCount: { $size: '$profiles' } } }",
        "{ $unset: 'profiles' }"
      })
  List<CategoryFilter> findAllWithCandidateCount();
}
