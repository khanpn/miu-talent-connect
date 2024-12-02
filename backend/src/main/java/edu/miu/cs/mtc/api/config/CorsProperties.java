package edu.miu.cs.mtc.api.config;

import java.util.List;
import lombok.Data;

@Data
public class CorsProperties {
  private List<String> allowedOrigins;
  private List<String> allowedMethods;
  private List<String> allowedHeaders;
  private Boolean allowCredentials;
}
