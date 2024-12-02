package edu.miu.cs.mtc.api.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TokenType {
  ACCESS("access"),
  REFRESH("refresh"),
  RESET_PASSWORD("reset_password");

  private final String value;
}
