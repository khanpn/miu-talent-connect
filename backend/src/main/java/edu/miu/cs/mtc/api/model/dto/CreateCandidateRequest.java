package edu.miu.cs.mtc.api.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CreateCandidateRequest extends CreateUserRequest {

  @NotNull(message = "{CandidateProfile.jobTitle.NotNull}")
  @Size(min = 1, max = 255, message = "{CandidateProfile.jobTitle.Size}")
  private String jobTitle;
}
