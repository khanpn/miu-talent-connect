package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.model.dto.ChangePasswordRequest;
import edu.miu.cs.mtc.api.model.dto.ResetPasswordRequest;
import edu.miu.cs.mtc.api.model.dto.ResetPasswordTokenRequest;
import edu.miu.cs.mtc.api.service.UserAccountService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import javax.security.auth.login.CredentialNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Slf4j
public class UserAccountController {

  private final UserAccountService accountService;

  @PostMapping("/change-password")
  public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
    try {
      accountService.changePassword(request);
      return ResponseEntity.noContent().build();
    } catch (CredentialNotFoundException e) {
      log.error("Cannot change password due to an error occurred", e);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Username or password is incorrect");
    }
  }

  @PostMapping("/reset-password-token-request")
  public ResponseEntity<?> resetPasswordTokenRequest(
      @Valid @RequestBody ResetPasswordTokenRequest request) {
    try {
      accountService.generateResetPasswordToken(request.getUsername());
      return ResponseEntity.accepted().build();
    } catch (CredentialNotFoundException e) {
      log.error("Cannot change password due to an error occurred", e);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Username or password is incorrect");
    } catch (MessagingException e) {
      throw new RuntimeException(e);
    }
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
    try {
      accountService.resetPassword(request);
      return ResponseEntity.noContent().build();
    } catch (CredentialNotFoundException e) {
      log.error("Cannot change password due to an error occurred", e);
      return ResponseEntity.badRequest().body("Username or password is incorrect");
    }
  }
}
