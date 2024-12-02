package edu.miu.cs.mtc.api.service;

import edu.miu.cs.mtc.api.model.dto.CreateCandidateRequest;
import edu.miu.cs.mtc.api.model.entity.Candidate;
import edu.miu.cs.mtc.api.model.entity.CandidateProfile;
import edu.miu.cs.mtc.api.model.entity.User;
import edu.miu.cs.mtc.api.model.enums.CandidateProfileStatus;
import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.repository.CandidateProfileRepository;
import edu.miu.cs.mtc.api.repository.CandidateRepository;
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
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Getter
public class CandidateService extends AbstractUserService {

  @Value("${app.emails.new-candidate.template:emails/new-candidate.html}")
  private String newUserEmailTemplate;

  @Value("${app.emails.new-candidate.subject:Welcome to MIU Talent Connect}")
  private String newUserEmailSubject;

  @Value("${app.login-url}")
  private String loginUrl;

  @Value("${app.user.credentials.default-password-length}")
  private Integer defaultPasswordLength;

  private final PasswordGenerator passwordGenerator;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;
  private final UserCredentialsRepository userCredentialsRepository;
  private final CandidateProfileRepository candidateProfileRepository;
  private final CandidateRepository candidateRepository;

  private final EmailService emailService;

  @Transactional
  public String createCandidate(CreateCandidateRequest request) throws MessagingException {
    var plainTextPassword = passwordGenerator.generateRandomPassword(defaultPasswordLength);
    User newUser = createNewUser(request, plainTextPassword, List.of(UserRole.CANDIDATE));

    CandidateProfile profile = new CandidateProfile();
    profile.setJobTitle(request.getJobTitle());
    profile.setStatus(CandidateProfileStatus.PENDING);
    profile.setOwner(request.getUsername());
    candidateProfileRepository.save(profile);

    Candidate candidate = new Candidate();
    candidate.setUser(newUser);
    candidate.setProfile(profile);
    candidate.setOwner(request.getUsername());
    var newCandidate = candidateRepository.save(candidate);
    sendNewAccountEmail(newUser, request.getUsername(), plainTextPassword);
    return newCandidate.getId();
  }
}
