package edu.miu.cs.mtc.api.model.entity;

import edu.miu.cs.mtc.api.model.enums.Pronoun;
import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.model.enums.UserStatus;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@EqualsAndHashCode(callSuper = true)
@Data
public class User extends Auditable {
  @Id private String id;

  @NotNull(message = "{User.firstName.NotNull}")
  @Size(min = 1, max = 255, message = "{User.firstName.Size}")
  private String firstName;

  @Size(max = 255, message = "{User.middleName.Size}")
  private String middleName;

  @NotNull(message = "{User.lastName.NotNull}")
  @Size(min = 1, max = 255, message = "{User.lastName.Size}")
  private String lastName;

  @Enumerated(EnumType.STRING)
  private Pronoun pronoun;

  @NotNull(message = "{User.email.NotNull}")
  @Email(
      regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      message = "{User.email.Email}")
  private String email;

  private String phoneNumber;

  @URL(message = "{User.profilePictureURL.URL}")
  private String profilePictureUrl;

  @NotNull(message = "{User.roles.NotNull}")
  @Size(min = 1, message = "{User.roles.Size}")
  @ElementCollection
  @Enumerated(EnumType.STRING)
  private List<UserRole> roles;

  @NotNull(message = "{User.status.NotNull}")
  @Enumerated(EnumType.STRING)
  private UserStatus status = UserStatus.PENDING;
}
