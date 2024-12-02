package edu.miu.cs.mtc.api.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CreateEmployerRequest extends CreateUserRequest {
  private String company;
}
