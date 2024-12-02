package edu.miu.cs.mtc.api.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
  @NotNull(message = "{ResetPasswordRequest.token.NotNull}")
  private String token;

  @NotNull(message = "{UserCredentials.password.NotNull}")
  @Size(min = 8, max = 255, message = "{UserCredentials.password.Size}")
  @Pattern(
      regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      message = "${UserCredentials.password.Pattern}")
  private String password;
}
