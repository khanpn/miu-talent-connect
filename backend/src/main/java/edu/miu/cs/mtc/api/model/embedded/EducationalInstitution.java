package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EducationalInstitution {

  @NotNull(message = "{EducationalInstitution.name.NotNull}")
  @Size(min = 1, max = 255, message = "{EducationalInstitution.name.Size}")
  private String name;

  private Address location;
}
