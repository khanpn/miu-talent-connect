package edu.miu.cs.mtc.api.mongodb;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class AggregationPipelineLoader {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Cacheable("aggregationPipelines")
  public List<Document> loadPipeline(String fileName, Map<String, Object> params)
      throws IOException {
    // Load JSON as a raw string
    String rawJson = new String(new ClassPathResource(fileName).getInputStream().readAllBytes());

    if (params != null) {
      // Replace placeholders with actual values
      for (Map.Entry<String, Object> entry : params.entrySet()) {
        rawJson =
            rawJson.replaceAll(
                "(\")?\\{\\{" + entry.getKey() + "\\}\\}(\")?", entry.getValue().toString());
      }
    }

    // Parse the updated JSON into a List<Document>
    return objectMapper.readValue(rawJson, new TypeReference<>() {});
  }
}
