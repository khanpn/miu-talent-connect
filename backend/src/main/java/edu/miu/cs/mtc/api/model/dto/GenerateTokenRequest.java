package edu.miu.cs.mtc.api.model.dto;

import lombok.Data;

@Data
public class GenerateTokenRequest {
  private String username;
  private String password;
}
