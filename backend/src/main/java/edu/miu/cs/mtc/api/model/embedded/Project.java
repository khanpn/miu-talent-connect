package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class Project {

  @NotNull(message = "{Project.title.NotNull}")
  @Size(min = 1, max = 255, message = "{Project.title.Size}")
  private String name;

  @NotNull(message = "{Project.description.NotNull}")
  @Size(min = 1, max = 1000, message = "{Project.description.Size}")
  private String description;

  @NotNull(message = "{Project.startDate.NotNull}")
  private LocalDate startDate;

  private LocalDate endDate;

  private String technologiesUsed;

  @URL(message = "{Project.url.URL}")
  private String url;
}
