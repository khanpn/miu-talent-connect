package edu.miu.cs.mtc.api.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CreateAdminUserRequest extends CreateUserRequest {
  private String department;
}
