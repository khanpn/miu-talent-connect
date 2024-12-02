package edu.miu.cs.mtc.api.handler.event;

import edu.miu.cs.mtc.api.model.entity.UserCredentials;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.data.rest.core.event.BeforeCreateEvent;
import org.springframework.data.rest.core.event.BeforeSaveEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserCredentialsEventHandler {

  private final PasswordEncoder passwordEncoder;
  private final UserCredentialsRepository userCredentialsRepository;

  @EventListener
  public void handleBeforeCreate(BeforeCreateEvent event) {
    if (event.getSource() instanceof UserCredentials userCredentials) {
      encodePassword(userCredentials);
    }
  }

  @EventListener
  public void handleBeforeSave(BeforeSaveEvent event) {
    if (event.getSource() instanceof UserCredentials userCredentials) {
      var existingOpt = userCredentialsRepository.findById(userCredentials.getId());
      if (existingOpt.isEmpty()) {
        encodePassword(userCredentials);
      } else {
        var existingUserCredentials = existingOpt.get();
        if (!existingUserCredentials.getPassword().equals(userCredentials.getPassword())) {
          encodePassword(userCredentials);
        }
      }
    }
  }

  private void encodePassword(UserCredentials userCredentials) {
    String plainTextPassword = userCredentials.getPassword();
    String encodedPassword = passwordEncoder.encode(plainTextPassword);
    userCredentials.setPassword(encodedPassword);
  }
}
