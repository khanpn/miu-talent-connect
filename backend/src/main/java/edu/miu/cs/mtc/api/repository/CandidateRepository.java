package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.aop.OwnershipCheck;
import edu.miu.cs.mtc.api.model.entity.Candidate;
import java.util.Optional;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

@OwnershipCheck
public interface CandidateRepository
    extends MongoRepository<Candidate, String>, CustomCandidateRepository {

  @Aggregation(
      pipeline = {
        "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as:"
            + " 'users' } }",
        "{ $match: { users: { $elemMatch: { _id: ?0 } } } }",
        "{ $unset: 'users' }"
      })
  Optional<Candidate> findByUserId(String userId);
}
