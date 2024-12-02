package edu.miu.cs.mtc.api.security;

import edu.miu.cs.mtc.api.model.enums.UserRole;
import edu.miu.cs.mtc.api.repository.UserCredentialsRepository;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserCredentialsRepository userCredentialsRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    var userCredentials =
        userCredentialsRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    var user = userCredentials.getUser();
    Set<GrantedAuthority> authorities =
        user.getRoles().stream().map(UserRole::getAuthority).collect(Collectors.toSet());
    return User.withUsername(userCredentials.getUsername())
        .password(userCredentials.getPassword())
        .authorities(authorities)
        .credentialsExpired(false)
        .accountExpired(false)
        .accountLocked(false)
        .disabled(false)
        .build();
  }
}
