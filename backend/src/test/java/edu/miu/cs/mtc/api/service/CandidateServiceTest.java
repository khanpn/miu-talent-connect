package edu.miu.cs.mtc.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import edu.miu.cs.mtc.api.model.dto.CreateCandidateRequest;
import edu.miu.cs.mtc.api.model.entity.Candidate;
import edu.miu.cs.mtc.api.model.entity.CandidateProfile;
import edu.miu.cs.mtc.api.model.entity.User;
import edu.miu.cs.mtc.api.model.entity.UserCredentials;
import edu.miu.cs.mtc.api.repository.CandidateProfileRepository;
import edu.miu.cs.mtc.api.repository.CandidateRepository;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import edu.miu.cs.mtc.api.repository.UserRepository;
import edu.miu.cs.mtc.api.security.PasswordGenerator;
import jakarta.mail.MessagingException;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

class CandidateServiceTest {

  @InjectMocks private CandidateService candidateService;

  @Mock private PasswordGenerator passwordGenerator;

  @Mock private PasswordEncoder passwordEncoder;

  @Mock private UserRepository userRepository;

  @Mock private UserCredentialsRepository userCredentialsRepository;

  @Mock private CandidateProfileRepository candidateProfileRepository;

  @Mock private CandidateRepository candidateRepository;

  @Mock private EmailService emailService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void createCandidate() throws MessagingException {
    CreateCandidateRequest request = new CreateCandidateRequest();
    request.setFirstName("John");
    request.setLastName("Doe");
    request.setEmail("john.doe@example.com");
    request.setUsername("johndoe");
    request.setJobTitle("Software Developer");

    String generatedPassword = "password123";
    when(passwordGenerator.generateRandomPassword(anyInt())).thenReturn(generatedPassword);
    when(passwordEncoder.encode(generatedPassword)).thenReturn("encodedPassword");

    User savedUser = new User();
    savedUser.setId("userId");
    when(userRepository.save(any(User.class))).thenReturn(savedUser);

    CandidateProfile savedProfile = new CandidateProfile();
    savedProfile.setId("profileId");
    when(candidateProfileRepository.save(any(CandidateProfile.class))).thenReturn(savedProfile);

    Candidate savedCandidate = new Candidate();
    var candidateId = "candidateId";
    savedCandidate.setId(candidateId);
    when(candidateRepository.save(any(Candidate.class))).thenReturn(savedCandidate);

    var loginUrl = "https://miutalentconnect.org/login";
    var emailSubject = "Welcome to MIU Talent Connect";
    var emailTemplate = "emails/new-candidate.html";
    candidateService.setDefaultPasswordLength(4);
    candidateService.setLoginUrl(loginUrl);
    candidateService.setNewUserEmailSubject(emailSubject);
    candidateService.setNewUserEmailTemplate(emailTemplate);

    // Act
    String savedCandidateId = candidateService.createCandidate(request);

    // Assert candidateId
    assertEquals(candidateId, savedCandidateId);

    // Verify interactions with UserRepository and UserCredentialsRepository
    verify(userRepository).save(any(User.class));
    verify(userCredentialsRepository).save(any(UserCredentials.class));

    // Verify interactions with CandidateProfileRepository and CandidateRepository
    verify(candidateProfileRepository).save(any(CandidateProfile.class));
    verify(candidateRepository).save(any(Candidate.class));

    // Verify email was sent
    verify(emailService)
        .sendEmail(
            eq(request.getEmail()),
            eq(emailSubject),
            eq(emailTemplate),
            argThat(
                argument -> {
                  assertTrue(argument.containsKey("username"));
                  assertEquals(request.getUsername(), argument.get("username"));
                  assertTrue(argument.containsKey("password"));
                  assertEquals(generatedPassword, argument.get("password"));
                  assertTrue(argument.containsKey("name"));
                  assertEquals(request.getFirstName(), argument.get("name"));
                  assertTrue(argument.containsKey("loginUrl"));
                  assertEquals(loginUrl, argument.get("loginUrl"));
                  assertTrue(argument.containsKey("year"));
                  assertEquals(LocalDateTime.now().getYear(), argument.get("year"));
                  return true;
                }));
  }
}
