package edu.miu.cs.mtc.api.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class ResetPasswordTokenRequest {
  @NotNull(message = "{UserCredentials.username.NotNull}")
  @Length(min = 4, max = 64, message = "{UserCredentials.username.Size}")
  private String username;
}
