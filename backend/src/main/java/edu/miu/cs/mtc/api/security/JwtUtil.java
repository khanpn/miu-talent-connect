package edu.miu.cs.mtc.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Collection;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtUtil {
  private static final String TOKEN_TYPE_CLAIM_NAME = "type";
  public static final String AUTHORITIES_CLAIM_NAME = "authorities";
  private final TokenBlacklistService tokenBlacklistService;
  private final JwtProperties jwtProperties;

  public String generateAccessToken(String username, Collection<GrantedAuthority> authorities) {
    return buildToken(username, jwtProperties.getAccessTokenTimeToLive(), TokenType.ACCESS)
        .claim(AUTHORITIES_CLAIM_NAME, authorities)
        .compact();
  }

  public String generateRefreshToken(String username, Collection<GrantedAuthority> authorities) {
    return buildToken(username, jwtProperties.getRefreshTokenTimeToLive(), TokenType.REFRESH)
        .claim(AUTHORITIES_CLAIM_NAME, authorities)
        .compact();
  }

  public String generateResetPasswordToken(String username) {
    return buildToken(
            username, jwtProperties.getResetPasswordTokenTimeToLive(), TokenType.RESET_PASSWORD)
        .compact();
  }

  public boolean validateToken(String token, TokenType tokenType) {
    if (tokenBlacklistService.isTokenRevoked(token)) {
      return false;
    }
    Claims claims = getClaims(token);
    return tokenType.getValue().equals(claims.get(TOKEN_TYPE_CLAIM_NAME))
        && !isTokenExpired(claims);
  }

  public String extractUsername(String token) {
    return getClaims(token).getSubject();
  }

  public Claims getClaims(String token) {
    return Jwts.parser()
        .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getSecretKey())))
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private JwtBuilder buildToken(String username, long timeToLive, TokenType tokenType) {
    return Jwts.builder()
        .subject(username)
        .claim(TOKEN_TYPE_CLAIM_NAME, tokenType.getValue())
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + timeToLive))
        .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getSecretKey())));
  }

  private boolean isTokenExpired(Claims claims) {
    return claims.getExpiration().before(new Date());
  }
}
