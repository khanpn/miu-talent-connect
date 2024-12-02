package edu.miu.cs.mtc.api.model.search;

import edu.miu.cs.mtc.api.model.embedded.Skill;
import edu.miu.cs.mtc.api.model.enums.CandidateProfileStatus;
import java.util.List;
import lombok.Data;

@Data
public class CandidateSearch {
  private String id;
  private String firstName;
  private String lastName;
  private String jobTitle;
  private String profilePictureUrl;
  private String summary;
  private List<Skill> skills;
  private List<String> primaryTechnologies;
  private String resumeUrl;
  private CandidateProfileStatus profileStatus;
  private String userId;
  private String profileId;
}
