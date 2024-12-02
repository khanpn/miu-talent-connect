package edu.miu.cs.mtc.api.service;

import edu.miu.cs.mtc.api.model.dto.CreateUserRequest;
import edu.miu.cs.mtc.api.model.entity.User;
import edu.miu.cs.mtc.api.model.entity.UserCredentials;
import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.model.enums.UserStatus;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import edu.miu.cs.mtc.api.repository.UserRepository;
import jakarta.mail.MessagingException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@NoArgsConstructor
public abstract class AbstractUserService {

  public abstract EmailService getEmailService();

  public abstract UserCredentialsRepository getUserCredentialsRepository();

  public abstract UserRepository getUserRepository();

  public abstract String getNewUserEmailSubject();

  public abstract String getNewUserEmailTemplate();

  public abstract String getLoginUrl();

  public abstract PasswordEncoder getPasswordEncoder();

  protected User createNewUser(
      CreateUserRequest request, String plainTextPassword, List<UserRole> roles) {
    validateCredentials(request);
    User newUser = new User();
    newUser.setFirstName(request.getFirstName());
    newUser.setLastName(request.getLastName());
    newUser.setEmail(request.getEmail());
    newUser.setRoles(roles);
    newUser.setStatus(UserStatus.PENDING);
    newUser.setOwner(request.getUsername());
    getUserRepository().save(newUser);

    UserCredentials userCredentials = new UserCredentials();
    userCredentials.setUsername(request.getUsername());
    userCredentials.setPassword(getPasswordEncoder().encode(plainTextPassword));
    userCredentials.setUser(newUser);
    getUserCredentialsRepository().save(userCredentials);

    return newUser;
  }

  protected void sendNewAccountEmail(User newUser, String username, String plainTextPassword)
      throws MessagingException {
    Map<String, Object> model = new HashMap<>();
    model.put("name", newUser.getFirstName());
    model.put("username", username);
    model.put("password", plainTextPassword);
    model.put("loginUrl", getLoginUrl());
    model.put("year", LocalDate.now().getYear());
    getEmailService()
        .sendEmail(newUser.getEmail(), getNewUserEmailSubject(), getNewUserEmailTemplate(), model);
  }

  protected void validateCredentials(CreateUserRequest request) {
    if (getUserCredentialsRepository().findByUsername(request.getUsername()).isPresent()) {
      throw new IllegalArgumentException("Username has already been taken");
    }
  }
}
