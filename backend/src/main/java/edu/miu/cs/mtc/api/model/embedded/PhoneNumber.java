package edu.miu.cs.mtc.api.model.embedded;

import lombok.Data;

@Data
public class PhoneNumber {
  private String countryCode;
  private String nationalNumber;
  private String extension;
}
