package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.aop.OwnershipCheck;
import edu.miu.cs.mtc.api.model.entity.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

@OwnershipCheck
public interface UserRepository extends MongoRepository<User, String> {

  @Aggregation(
      pipeline = {
        "{ $lookup: { from: 'user_credentials', localField: '_id', foreignField: 'user.$id', as:"
            + " 'credentials' } }",
        "{ $match: { credentials: { $elemMatch: { username: ?0 } } } }",
        "{ $unset: 'credentials' }"
      })
  Optional<User> findUserByUsername(String username);

  @Override
  <S extends User> S save(S entity);
}
