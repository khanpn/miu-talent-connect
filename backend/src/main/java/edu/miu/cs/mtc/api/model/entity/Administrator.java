package edu.miu.cs.mtc.api.model.entity;

import edu.miu.cs.mtc.api.model.enums.UserStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "administrators")
@EqualsAndHashCode(callSuper = true)
@Data
public class Administrator extends Auditable {

  @Id private String id;

  private String department;

  @DBRef private User user;

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

  public UserStatus getStatus() {
    return user.getStatus();
  }

  public String getUserId() {
    return user.getId();
  }
}
