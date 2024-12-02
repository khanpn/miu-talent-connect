package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.aop.OwnershipCheck;
import edu.miu.cs.mtc.api.model.entity.UserCredentials;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

@OwnershipCheck
public interface UserCredentialsRepository extends MongoRepository<UserCredentials, String> {

  Optional<UserCredentials> findByUsername(String username);
}
