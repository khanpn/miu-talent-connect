package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.model.entity.BlacklistedToken;
import java.time.LocalDateTime;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BlacklistedTokenRepository extends MongoRepository<BlacklistedToken, String> {
  void deleteAllByExpirationTimeBefore(LocalDateTime localDateTime);
}
