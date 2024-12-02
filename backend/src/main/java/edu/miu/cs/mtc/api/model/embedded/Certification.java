package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class Certification {

  @NotNull(message = "{Certification.name.NotNull}")
  @Size(min = 1, max = 255, message = "{Certification.name.Size}")
  private String name;

  @NotNull(message = "{Certification.issuedBy.NotNull}")
  @Size(min = 1, max = 255, message = "{Certification.issuedBy.Size}")
  private String issuedBy;

  @NotNull(message = "{Certification.dateIssued.NotNull}")
  private LocalDate dateIssued;

  private LocalDate expirationDate;

  private String credentialID;

  @URL(message = "{Certification.url.URL}")
  private String url;
}
