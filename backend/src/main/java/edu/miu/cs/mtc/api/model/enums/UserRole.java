package edu.miu.cs.mtc.api.model.enums;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum UserRole {
  EMPLOYER,
  CANDIDATE,
  ADMIN,
  SYSTEM_ADMIN;
  private static final String AUTHORITY_PREFIX = "ROLE_";

  public GrantedAuthority getAuthority() {
    return new SimpleGrantedAuthority(AUTHORITY_PREFIX + name());
  }
}
