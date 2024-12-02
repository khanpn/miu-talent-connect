package edu.miu.cs.mtc.api.model.embedded;

import edu.miu.cs.mtc.api.model.enums.EducationalDegreeStatus;
import edu.miu.cs.mtc.api.model.enums.EducationalDegreeType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

@Data
public class Education {

  @NotNull(message = "{Education.degreeType.NotNull}")
  private EducationalDegreeType degreeType;

  @NotNull(message = "{Education.fieldOfStudy.NotNull}")
  private String fieldOfStudy;

  @NotNull(message = "{Education.startDate.NotNull}")
  private LocalDate startDate;

  private LocalDate endDate;

  private EducationalDegreeStatus degreeStatus;

  private String gpa;

  @Valid
  @NotNull(message = "{Education.institution.NotNull}")
  private EducationalInstitution institution;
}
