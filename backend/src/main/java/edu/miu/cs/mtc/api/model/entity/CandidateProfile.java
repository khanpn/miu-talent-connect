package edu.miu.cs.mtc.api.model.entity;

import edu.miu.cs.mtc.api.model.embedded.*;
import edu.miu.cs.mtc.api.model.enums.CandidateProfileStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "candidate_profiles")
@EqualsAndHashCode(callSuper = true)
@Data
public class CandidateProfile extends Auditable {
  @Id private String id;

  @NotNull(message = "{CandidateProfile.jobTitle.NotNull}")
  @Size(min = 1, max = 255, message = "{CandidateProfile.jobTitle.Size}")
  private String jobTitle;

  @Size(max = 1000, message = "{CandidateProfile.bio.Size}")
  private String bio;

  @Size(max = 1000, message = "{CandidateProfile.summary.Size}")
  private String summary;

  private String resumeUrl;

  @NotNull(message = "{CandidateProfile.status.NotNull}")
  private CandidateProfileStatus status;

  @Valid private Address address;

  @Valid private List<Education> education;

  @Valid private List<WorkExperience> experience;

  @Valid private List<Skill> skills;

  @Valid
  @Size(max = 3, message = "{CandidateProfile.primaryTechnologies.Size}")
  private List<String> primaryTechnologies;

  @Valid private List<Certification> certifications;

  @Valid private List<Project> projects;

  @Valid private List<Reference> references;

  @Valid private List<Language> languages;

  private List<Website> websites;
}
