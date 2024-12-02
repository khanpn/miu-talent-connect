package edu.miu.cs.mtc.api.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GenerateTokenResponse {
  private String accessToken;
  private String refreshToken;
}
