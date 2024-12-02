package edu.miu.cs.mtc.api.model.entity;

import edu.miu.cs.mtc.api.model.enums.CandidateProfileStatus;
import edu.miu.cs.mtc.api.model.enums.UserStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "candidates")
@EqualsAndHashCode(callSuper = true)
@Data
public class Candidate extends Auditable {
  @Id private String id;

  @DBRef private User user;

  @DBRef private CandidateProfile profile;

  public String getFirstName() {
    return user.getFirstName();
  }

  public String getLastName() {
    return user.getLastName();
  }

  public String getEmail() {
    return user.getEmail();
  }

  public String getPhoneNumber() {
    return user.getPhoneNumber();
  }

  public String getProfilePictureUrl() {
    return user.getProfilePictureUrl();
  }

  public String getJobTitle() {
    return profile.getJobTitle();
  }

  public UserStatus getStatus() {
    return user.getStatus();
  }

  public CandidateProfileStatus getProfileStatus() {
    return profile.getStatus();
  }

  public String getResumeUrl() {
    return profile.getResumeUrl();
  }

  public String getUserId() {
    return user.getId();
  }

  public String getProfileId() {
    return profile.getId();
  }
}
