package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.model.dto.GenerateTokenRequest;
import edu.miu.cs.mtc.api.model.dto.GenerateTokenResponse;
import edu.miu.cs.mtc.api.model.dto.RefreshTokenRequest;
import edu.miu.cs.mtc.api.security.JwtUtil;
import edu.miu.cs.mtc.api.security.TokenType;
import java.util.Collection;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tokens")
@RequiredArgsConstructor
@Slf4j
public class TokenController {

  private final AuthenticationManager authenticationManager;

  private final JwtUtil jwtUtil;

  @PostMapping("/generate")
  public ResponseEntity<GenerateTokenResponse> generate(@RequestBody GenerateTokenRequest request) {
    UsernamePasswordAuthenticationToken authentication =
        (UsernamePasswordAuthenticationToken)
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()));
    Collection<GrantedAuthority> authorities = authentication.getAuthorities();
    return ResponseEntity.ok(
        GenerateTokenResponse.builder()
            .accessToken(jwtUtil.generateAccessToken(request.getUsername(), authorities))
            .refreshToken(jwtUtil.generateRefreshToken(request.getUsername(), authorities))
            .build());
  }

  @SuppressWarnings("unchecked")
  @PostMapping("/refresh")
  public ResponseEntity<GenerateTokenResponse> generate(@RequestBody RefreshTokenRequest request) {
    var refreshToken = request.getRefreshToken();
    if (jwtUtil.validateToken(refreshToken, TokenType.REFRESH)) {
      var claims = jwtUtil.getClaims(refreshToken);
      return ResponseEntity.ok(
          GenerateTokenResponse.builder()
              .accessToken(
                  jwtUtil.generateAccessToken(
                      claims.getSubject(), claims.get(JwtUtil.AUTHORITIES_CLAIM_NAME, Set.class)))
              .refreshToken(
                  jwtUtil.generateRefreshToken(
                      claims.getSubject(), claims.get(JwtUtil.AUTHORITIES_CLAIM_NAME, Set.class)))
              .build());
    }
    throw new BadCredentialsException("Username or token is invalid");
  }
}
