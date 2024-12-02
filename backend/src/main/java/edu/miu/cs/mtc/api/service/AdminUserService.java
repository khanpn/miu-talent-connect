package edu.miu.cs.mtc.api.service;

import edu.miu.cs.mtc.api.model.dto.CreateAdminUserRequest;
import edu.miu.cs.mtc.api.model.entity.Administrator;
import edu.miu.cs.mtc.api.model.entity.User;
import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.repository.*;
import edu.miu.cs.mtc.api.security.PasswordGenerator;
import jakarta.mail.MessagingException;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Getter
public class AdminUserService extends AbstractUserService {
  @Value("${app.emails.new-administrator.template:emails/new-administrator.html}")
  private String newUserEmailTemplate;

  @Value("${app.emails.new-administrator.subject:Welcome to MIU Talent Connect}")
  private String newUserEmailSubject;

  @Value("${app.login-url}")
  private String loginUrl;

  @Value("${app.user.credentials.default-password-length}")
  private Integer defaultPasswordLength;

  private final PasswordGenerator passwordGenerator;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;
  private final UserCredentialsRepository userCredentialsRepository;
  private final AdministratorRepository administratorRepository;

  private final EmailService emailService;

  public String createAdminUser(CreateAdminUserRequest request) throws MessagingException {
    var plainTextPassword = passwordGenerator.generateRandomPassword(defaultPasswordLength);
    User newUser = createNewUser(request, plainTextPassword, List.of(UserRole.ADMIN));

    Administrator administrator = new Administrator();
    administrator.setDepartment(request.getDepartment());
    administrator.setUser(newUser);
    administrator.setOwner(request.getUsername());
    var savedAdminUser = administratorRepository.save(administrator);
    sendNewAccountEmail(newUser, request.getUsername(), plainTextPassword);

    return savedAdminUser.getId();
  }

  public void createSystemAdminUser(String username, String plainTextPassword) {
    CreateAdminUserRequest request = new CreateAdminUserRequest();
    request.setUsername(username);
    request.setFirstName(username);
    User newUser = createNewUser(request, plainTextPassword, List.of(UserRole.SYSTEM_ADMIN));

    Administrator administrator = new Administrator();
    administrator.setDepartment(request.getDepartment());
    administrator.setUser(newUser);
    administrator.setOwner(request.getUsername());
    administratorRepository.save(administrator);
  }
}
