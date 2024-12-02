package edu.miu.cs.mtc.api.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtProperties {
  private String secretKey;
  private Long accessTokenTimeToLive;
  private Long refreshTokenTimeToLive;
  private Long resetPasswordTokenTimeToLive;
}
