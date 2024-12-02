package edu.miu.cs.mtc.api.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class ChangePasswordRequest {
  @NotNull(message = "{UserCredentials.username.NotNull}")
  @Length(min = 4, max = 64, message = "{UserCredentials.username.Size}")
  private String username;

  @NotNull(message = "{UserCredentials.password.NotNull}")
  private String oldPassword;

  @NotNull(message = "{UserCredentials.password.NotNull}")
  @Size(min = 8, max = 255, message = "{UserCredentials.password.Size}")
  @Pattern(
      regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      message = "${UserCredentials.password.Pattern}")
  private String newPassword;
}
