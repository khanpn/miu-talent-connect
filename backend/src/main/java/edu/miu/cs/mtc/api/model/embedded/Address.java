package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Address {
  @NotNull(message = "{Address.street.NotNull}")
  private String street;

  private String apt;

  @NotNull(message = "{Address.city.NotNull}")
  private String city;

  @NotNull(message = "{Address.state.NotNull}")
  private String state;

  @NotNull(message = "{Address.countryCode.NotNull}")
  private String countryCode;

  @NotNull(message = "{Address.zipCode.NotNull}")
  private String zipCode;
}
