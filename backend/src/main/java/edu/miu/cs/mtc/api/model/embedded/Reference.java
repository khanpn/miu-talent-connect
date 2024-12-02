package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Reference {

  @NotNull(message = "{Reference.firstName.NotNull}")
  @Size(min = 1, max = 255, message = "{Reference.firstName.Size}")
  private String firstName;

  @Size(max = 255, message = "{Reference.middleName.Size}")
  private String middleName;

  @NotNull(message = "{Reference.lastName.NotNull}")
  @Size(min = 1, max = 255, message = "{Reference.lastName.Size}")
  private String lastName;

  @Email(message = "{Reference.email.Email}")
  private String email;

  @Valid private String phoneNumber;

  @NotNull(message = "{Reference.relationship.NotNull}")
  private String relationship;
}
