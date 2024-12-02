package edu.miu.cs.mtc.api.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;

  @SuppressWarnings("unchecked")
  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String authHeader = request.getHeader("Authorization");

      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String jwt = authHeader.substring(7);
        boolean isValidToken = jwtUtil.validateToken(jwt, TokenType.ACCESS);
        if (isValidToken) {
          var claims = jwtUtil.getClaims(jwt);
          var authorities = claims.get(JwtUtil.AUTHORITIES_CLAIM_NAME, Collection.class);
          Collection<GrantedAuthority> grantedAuthorities =
              (Collection<GrantedAuthority>)
                  authorities.stream()
                      .map(
                          authority ->
                              new SimpleGrantedAuthority(
                                  ((Map<String, String>) authority).get("authority")))
                      .collect(Collectors.toSet());
          UsernamePasswordAuthenticationToken authentication =
              new UsernamePasswordAuthenticationToken(
                  claims.getSubject(), null, grantedAuthorities);
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }

      filterChain.doFilter(request, response);
    } catch (JwtException jwtException) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Error: " + jwtException.getMessage());
    }
  }
}
