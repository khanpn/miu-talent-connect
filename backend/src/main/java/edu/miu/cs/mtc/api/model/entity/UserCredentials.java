package edu.miu.cs.mtc.api.model.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_credentials")
@EqualsAndHashCode(callSuper = true)
@Data
public class UserCredentials extends Auditable {
  @Id private String id;

  @NotNull(message = "{UserCredentials.username.NotNull}")
  @Length(min = 4, max = 64, message = "{UserCredentials.username.Size}")
  @Pattern(
      regexp = "^(?=.{4,60}$)(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$",
      message = "{UserCredentials.username.Pattern}")
  private String username;

  @NotNull(message = "{UserCredentials.password.NotNull}")
  @Size(min = 8, max = 255, message = "{UserCredentials.password.Size}")
  private String password;

  @NotNull(message = "{UserCredentials.user.NotNull}")
  @DBRef
  private User user;

  @Override
  public String getOwner() {
    return username;
  }
}
