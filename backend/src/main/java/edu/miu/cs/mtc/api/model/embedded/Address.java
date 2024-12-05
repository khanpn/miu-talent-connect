package edu.miu.cs.mtc.api.model.embedded;

import lombok.Data;

@Data
public class Address {
  private String street;
  private String apt;
  private String city;
  private String state;
  private String countryCode;
  private String zipCode;
}
