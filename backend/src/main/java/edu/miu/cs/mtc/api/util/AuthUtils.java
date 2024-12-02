package edu.miu.cs.mtc.api.util;

import edu.miu.cs.mtc.api.model.enums.UserRole;
import java.util.Collection;
import java.util.Optional;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@UtilityClass
public class AuthUtils {

  public static Optional<Authentication> getCurrentAuthentication() {
    return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());
  }

  public static Optional<String> getCurrentUsername() {
    return getCurrentAuthentication()
        .filter(Authentication::isAuthenticated)
        .map(Authentication::getName);
  }

  public static boolean isAdminUser() {
    return getCurrentAuthentication().map(Authentication::getAuthorities).stream()
        .flatMap(Collection::stream)
        .anyMatch(
            grantedAuthority ->
                UserRole.ADMIN.getAuthority().equals(grantedAuthority)
                    || UserRole.SYSTEM_ADMIN.getAuthority().equals(grantedAuthority));
  }
}
