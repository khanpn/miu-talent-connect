package edu.miu.cs.mtc.api.config;

import edu.miu.cs.mtc.api.security.JwtProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

  @Bean
  @ConfigurationProperties("app.jwt")
  public JwtProperties jwtProperties() {
    return new JwtProperties();
  }
}
