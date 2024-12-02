package edu.miu.cs.mtc.api.service;

import edu.miu.cs.mtc.api.model.dto.CreateEmployerRequest;
import edu.miu.cs.mtc.api.model.entity.Employer;
import edu.miu.cs.mtc.api.model.entity.User;
import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.repository.EmployerRepository;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import edu.miu.cs.mtc.api.repository.UserRepository;
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
public class EmployerService extends AbstractUserService {

  @Value("${app.emails.new-employer.template:emails/new-employer.html}")
  private String newUserEmailTemplate;

  @Value("${app.emails.new-employer.subject:Welcome to MIU Talent Connect}")
  private String newUserEmailSubject;

  @Value("${app.user.credentials.default-password-length}")
  private Integer defaultPasswordLength;

  @Value("${app.login-url}")
  private String loginUrl;

  private final PasswordGenerator passwordGenerator;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;
  private final UserCredentialsRepository userCredentialsRepository;
  private final EmployerRepository employerRepository;

  private final EmailService emailService;

  public String createEmployer(CreateEmployerRequest request) throws MessagingException {
    var plainTextPassword = passwordGenerator.generateRandomPassword(defaultPasswordLength);
    User newUser = createNewUser(request, plainTextPassword, List.of(UserRole.EMPLOYER));

    Employer employer = new Employer();
    employer.setCompany(request.getCompany());
    employer.setUser(newUser);
    employer.setOwner(request.getUsername());
    var savedEmployer = employerRepository.save(employer);
    sendNewAccountEmail(newUser, request.getUsername(), plainTextPassword);

    return savedEmployer.getId();
  }
}
