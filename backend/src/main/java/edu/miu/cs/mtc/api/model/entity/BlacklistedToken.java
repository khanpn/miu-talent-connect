package edu.miu.cs.mtc.api.model.entity;

import java.time.LocalDateTime;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "blacklisted_tokens")
@Data
public class BlacklistedToken {
  @Id private String token;

  private LocalDateTime expirationTime;
}
