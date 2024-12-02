package edu.miu.cs.mtc.api.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public abstract class CreateUserRequest {
  @NotNull(message = "{UserCredentials.username.NotNull}")
  @Length(min = 4, max = 64, message = "{UserCredentials.username.Size}")
  @Pattern(
      regexp = "^(?=.{3,30}$)(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$",
      message = "{UserCredentials.username.Pattern}")
  private String username;

  @NotNull(message = "{User.firstName.NotNull}")
  @Size(min = 1, max = 255, message = "{User.firstName.Size}")
  private String firstName;

  @NotNull(message = "{User.lastName.NotNull}")
  @Size(min = 1, max = 255, message = "{User.lastName.Size}")
  private String lastName;

  @Email(
      regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      message = "{User.email.Email}")
  private String email;
}
