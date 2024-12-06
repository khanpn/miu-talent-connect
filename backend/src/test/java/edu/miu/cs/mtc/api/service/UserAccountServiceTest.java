package edu.miu.cs.mtc.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import edu.miu.cs.mtc.api.model.dto.ChangePasswordRequest;
import edu.miu.cs.mtc.api.model.dto.ResetPasswordRequest;
import edu.miu.cs.mtc.api.model.entity.User;
import edu.miu.cs.mtc.api.model.entity.UserCredentials;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import edu.miu.cs.mtc.api.repository.UserRepository;
import edu.miu.cs.mtc.api.security.JwtUtil;
import edu.miu.cs.mtc.api.security.TokenBlacklistService;
import edu.miu.cs.mtc.api.security.TokenType;
import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.mail.MessagingException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import javax.security.auth.login.CredentialNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserAccountServiceTest {

  @InjectMocks private UserAccountService userAccountService;

  @Mock private UserRepository userRepository;

  @Mock private UserCredentialsRepository userCredentialsRepository;

  @Mock private TokenBlacklistService tokenBlacklistService;

  @Mock private PasswordEncoder passwordEncoder;

  @Mock private JwtUtil jwtUtil;

  @Mock private EmailService emailService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void changePassword() throws CredentialNotFoundException {
    ChangePasswordRequest request = new ChangePasswordRequest();
    request.setUsername("testUser");
    request.setOldPassword("oldPassword");
    request.setNewPassword("newPassword");

    UserCredentials credentials = new UserCredentials();
    credentials.setPassword("encodedOldPassword");

    when(userCredentialsRepository.findByUsername("testUser")).thenReturn(Optional.of(credentials));
    when(passwordEncoder.matches("oldPassword", "encodedOldPassword")).thenReturn(true);
    when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");

    // Act
    userAccountService.changePassword(request);

    // Assert
    verify(userCredentialsRepository).save(credentials);
    assertEquals("encodedNewPassword", credentials.getPassword());
  }

  @Test
  void testChangePasswordInvalidOldPassword() {
    ChangePasswordRequest request = new ChangePasswordRequest();
    request.setUsername("testUser");
    request.setOldPassword("wrongPassword");
    request.setNewPassword("newPassword");

    UserCredentials credentials = new UserCredentials();
    credentials.setPassword("encodedOldPassword");

    when(userCredentialsRepository.findByUsername("testUser")).thenReturn(Optional.of(credentials));
    when(passwordEncoder.matches("wrongPassword", "encodedOldPassword")).thenReturn(false);

    // Act & Assert
    assertThrows(
        CredentialNotFoundException.class, () -> userAccountService.changePassword(request));
  }

  @Test
  void generateResetPasswordToken() throws MessagingException, CredentialNotFoundException {
    String username = "testUser";
    User user = new User();
    user.setFirstName("John");
    user.setEmail("john.doe@example.com");

    var generatedToken = "resetToken";
    when(userRepository.findUserByUsername(username)).thenReturn(Optional.of(user));
    when(jwtUtil.generateResetPasswordToken(username)).thenReturn(generatedToken);

    var resetPasswordBaseUrl = "https://miutalentconnect.org/login";
    var emailSubject = "Password Reset Request";
    var emailTemplate = "emails/reset-password-email.html";
    userAccountService.setResetPasswordBaseUrl(resetPasswordBaseUrl);
    userAccountService.setResetPasswordEmailSubject(emailSubject);
    userAccountService.setResetPasswordEmailTemplate(emailTemplate);

    // Act
    userAccountService.generateResetPasswordToken(username);

    // Assert
    verify(emailService)
        .sendEmail(
            eq(user.getEmail()),
            eq(emailSubject),
            eq(emailTemplate),
            argThat(
                argument -> {
                  var expectedResetPasswordLink = resetPasswordBaseUrl + "?token=" + generatedToken;
                  assertTrue(argument.containsKey("username"));
                  assertEquals(username, argument.get("username"));
                  assertTrue(argument.containsKey("name"));
                  assertEquals(user.getFirstName(), argument.get("name"));
                  assertTrue(argument.containsKey("resetLink"));
                  assertEquals(expectedResetPasswordLink, argument.get("resetLink"));
                  assertTrue(argument.containsKey("year"));
                  assertEquals(LocalDateTime.now().getYear(), argument.get("year"));
                  return true;
                }));
  }

  @Test
  void testGenerateResetPasswordTokenInvalidUser() {
    // Arrange
    String username = "nonExistentUser";
    when(userRepository.findUserByUsername(username)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        CredentialNotFoundException.class,
        () -> userAccountService.generateResetPasswordToken(username));
  }

  @Test
  void resetPassword() throws CredentialNotFoundException {
    String token = "validToken";
    String username = "testUser";
    ResetPasswordRequest request = new ResetPasswordRequest();
    request.setToken(token);
    request.setPassword("newPassword");

    UserCredentials credentials = new UserCredentials();

    when(jwtUtil.validateToken(token, TokenType.RESET_PASSWORD)).thenReturn(true);
    when(jwtUtil.extractUsername(token)).thenReturn(username);

    var claims = mock(DefaultClaims.class);
    when(claims.getExpiration()).thenReturn(new Date());
    when(jwtUtil.getClaims(token)).thenReturn(claims);
    when(userCredentialsRepository.findByUsername(username)).thenReturn(Optional.of(credentials));
    when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");

    // Act
    userAccountService.resetPassword(request);

    // Assert
    verify(userCredentialsRepository).save(credentials);
    verify(tokenBlacklistService).revokeToken(eq(token), any(LocalDateTime.class));
    assertEquals("encodedNewPassword", credentials.getPassword());
  }

  @Test
  void testResetPasswordInvalidToken() {
    // Arrange
    String token = "invalidToken";
    ResetPasswordRequest request = new ResetPasswordRequest();
    request.setToken(token);
    request.setPassword("newPassword");

    when(jwtUtil.validateToken(token, TokenType.RESET_PASSWORD)).thenReturn(false);

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> userAccountService.resetPassword(request));
  }

  @Test
  void testResetPasswordUserNotFound() {
    // Arrange
    String token = "validToken";
    ResetPasswordRequest request = new ResetPasswordRequest();
    request.setToken(token);
    request.setPassword("newPassword");

    when(jwtUtil.validateToken(token, TokenType.RESET_PASSWORD)).thenReturn(true);
    when(jwtUtil.extractUsername(token)).thenReturn("testUser");
    when(userCredentialsRepository.findByUsername("testUser")).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        CredentialNotFoundException.class, () -> userAccountService.resetPassword(request));
  }
}
