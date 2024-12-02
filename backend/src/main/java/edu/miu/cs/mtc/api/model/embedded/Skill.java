package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class Skill {

  @NotNull(message = "{Skill.name.NotNull}")
  @Size(min = 1, max = 255, message = "{Skill.name.Size}")
  private String name;

  @Min(value = 0, message = "{Skill.yearOfExperience.Min}")
  @Max(value = 50, message = "{Skill.yearOfExperience.Max}")
  private Integer yearOfExperience;
}
