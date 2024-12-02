package edu.miu.cs.mtc.api.config;

import edu.miu.cs.mtc.api.util.AuthUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
public class AuditorAwareConfig {

  @Bean
  public AuditorAware<String> auditorProvider() {
    return AuthUtils::getCurrentUsername;
  }
}
