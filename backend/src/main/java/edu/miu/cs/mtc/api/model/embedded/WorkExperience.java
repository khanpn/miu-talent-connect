package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Data;

@Data
public class WorkExperience {

  @NotNull(message = "{WorkExperience.jobTitle.NotNull}")
  @Size(min = 1, max = 255, message = "{WorkExperience.jobTitle.Size}")
  private String jobTitle;

  @NotNull(message = "{WorkExperience.company.NotNull}")
  @Size(min = 1, max = 255, message = "{WorkExperience.company.Size}")
  private String company;

  private Address location;

  private LocalDate startDate;

  private LocalDate endDate;

  private String responsibilities;
}
