package edu.miu.cs.mtc.api.model.dto;

import java.util.Date;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ErrorResponse {
  private final Date timestamp = new Date();
  private String message;
}
