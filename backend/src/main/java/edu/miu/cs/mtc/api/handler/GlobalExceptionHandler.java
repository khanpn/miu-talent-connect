package edu.miu.cs.mtc.api.handler;

import edu.miu.cs.mtc.api.model.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler({AccessDeniedException.class, SecurityException.class})
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(RuntimeException ex) {
    return response(HttpStatus.FORBIDDEN, "Access Denied: " + ex.getMessage());
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex) {
    return response(HttpStatus.UNAUTHORIZED, "Unauthorized: " + ex.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> illegalArgumentException(IllegalArgumentException ex) {
    return response(HttpStatus.BAD_REQUEST, ex.getMessage());
  }

  private ResponseEntity<ErrorResponse> response(HttpStatus status, String message) {
    return ResponseEntity.status(status).body(ErrorResponse.builder().message(message).build());
  }
}
