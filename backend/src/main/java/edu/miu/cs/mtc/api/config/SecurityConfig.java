package edu.miu.cs.mtc.api.config;

import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractAuthenticationFilterConfigurer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtFilter jwtFilter;
  private final CorsConfigurationSource corsConfigurationSource;
  private final UserDetailsService userDetailsService;

  @Value("${spring.data.rest.base-path:}")
  private String restBasePath;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource))
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/actuator/**",
                        "/login",
                        restBasePath + "/tokens/generate",
                        restBasePath + "/tokens/refresh",
                        restBasePath + "/accounts/reset-password-token-request",
                        restBasePath + "/accounts/reset-password",
                        restBasePath + "/files/**")
                    .permitAll()
                    .requestMatchers(
                        HttpMethod.GET,
                        restBasePath + "/categories/**",
                        restBasePath + "/candidates/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, restBasePath + "/candidates/quick-create")
                    .permitAll()
                    .requestMatchers(restBasePath + "/administrators/**")
                    .hasRole(UserRole.SYSTEM_ADMIN.name())
                    .requestMatchers(HttpMethod.DELETE, "/**")
                    .hasAnyRole(UserRole.SYSTEM_ADMIN.name(), UserRole.ADMIN.name())
                    .anyRequest()
                    .authenticated())
        .formLogin(AbstractAuthenticationFilterConfigurer::permitAll)
        .exceptionHandling(
            configurer ->
                configurer.defaultAuthenticationEntryPointFor(
                    (request, response, authException) ->
                        response.sendError(
                            HttpStatus.UNAUTHORIZED.value(),
                            HttpStatus.UNAUTHORIZED.getReasonPhrase()),
                    request ->
                        !request.getRequestURI().isEmpty()
                            && !request.getRequestURI().equals("/")
                            && !request.getRequestURI().startsWith(restBasePath + "/explorer")))
        .logout(LogoutConfigurer::permitAll);
    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public AuthenticationManager authManager(HttpSecurity http) throws Exception {
    AuthenticationManagerBuilder authenticationManagerBuilder =
        http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder
        .userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder());
    return authenticationManagerBuilder.build();
  }
}
