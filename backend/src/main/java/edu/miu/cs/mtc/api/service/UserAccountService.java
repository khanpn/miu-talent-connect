package edu.miu.cs.mtc.api.service;

import edu.miu.cs.mtc.api.model.dto.ChangePasswordRequest;
import edu.miu.cs.mtc.api.model.dto.ResetPasswordRequest;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import edu.miu.cs.mtc.api.repository.UserRepository;
import edu.miu.cs.mtc.api.security.JwtUtil;
import edu.miu.cs.mtc.api.security.TokenBlacklistService;
import edu.miu.cs.mtc.api.security.TokenType;
import jakarta.mail.MessagingException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import javax.security.auth.login.CredentialNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Setter
public class UserAccountService {
  @Value("${app.emails.reset-password.template:emails/reset-password-email.html}")
  private String resetPasswordEmailTemplate;

  @Value("${app.emails.reset-password.subject:Password Reset Request}")
  private String resetPasswordEmailSubject;

  @Value("${app.reset-password-url}")
  private String resetPasswordBaseUrl;

  private final UserRepository userRepository;
  private final UserCredentialsRepository userCredentialsRepository;
  private final TokenBlacklistService tokenBlacklistService;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final EmailService emailService;

  public void changePassword(ChangePasswordRequest request) throws CredentialNotFoundException {
    var userCredentials =
        userCredentialsRepository
            .findByUsername(request.getUsername())
            .orElseThrow(CredentialNotFoundException::new);
    if (!passwordEncoder.matches(request.getOldPassword(), userCredentials.getPassword())) {
      throw new CredentialNotFoundException();
    }
    userCredentials.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userCredentialsRepository.save(userCredentials);
  }

  public void generateResetPasswordToken(String username)
      throws CredentialNotFoundException, MessagingException {
    var user =
        userRepository
            .findUserByUsername(username)
            .orElseThrow(() -> new CredentialNotFoundException("Username does not exist"));
    var token = jwtUtil.generateResetPasswordToken(username);

    Map<String, Object> model = new HashMap<>();
    model.put("name", user.getFirstName());
    model.put("username", username);
    model.put("resetLink", resetPasswordBaseUrl + "?token=" + token);
    model.put("year", LocalDate.now().getYear());
    emailService.sendEmail(
        user.getEmail(), resetPasswordEmailSubject, resetPasswordEmailTemplate, model);
  }

  public void resetPassword(ResetPasswordRequest request) throws CredentialNotFoundException {
    var token = request.getToken();
    if (!jwtUtil.validateToken(token, TokenType.RESET_PASSWORD)) {
      throw new IllegalArgumentException("Invalid token for resetting password");
    }
    var username = jwtUtil.extractUsername(token);
    var userCredentials =
        userCredentialsRepository
            .findByUsername(username)
            .orElseThrow(
                () ->
                    new CredentialNotFoundException("No credential associates to token be found"));
    userCredentials.setPassword(passwordEncoder.encode(request.getPassword()));
    userCredentialsRepository.save(userCredentials);
    tokenBlacklistService.revokeToken(
        token,
        LocalDateTime.ofInstant(
            jwtUtil.getClaims(token).getExpiration().toInstant(), ZoneId.systemDefault()));
  }
}
