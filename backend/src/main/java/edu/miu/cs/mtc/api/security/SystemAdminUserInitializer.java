package edu.miu.cs.mtc.api.security;

import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import edu.miu.cs.mtc.api.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SystemAdminUserInitializer implements CommandLineRunner {
  private final UserCredentialsRepository userCredentialsRepository;
  private final AdminUserService adminUserService;

  @Value("${app.user.default-system-admin.username}")
  private String defaultSystemAdminUsername;

  @Value("${app.user.default-system-admin.password}")
  private String defaultSystemAdminPassword;

  @Override
  public void run(String... args) {
    if (defaultSystemAdminUsername == null || defaultSystemAdminUsername.isBlank()) {
      return;
    }

    if (defaultSystemAdminPassword == null || defaultSystemAdminPassword.isBlank()) {
      throw new IllegalArgumentException(
          "Default System Admin username is provided but password is missing");
    }
    if (userCredentialsRepository.findByUsername(defaultSystemAdminUsername).isPresent()) {
      return;
    }
    adminUserService.createSystemAdminUser(defaultSystemAdminUsername, defaultSystemAdminPassword);
    log.info("Created default System Admin User with username = {}", defaultSystemAdminUsername);
  }
}
