package edu.miu.cs.mtc.api.security;

import edu.miu.cs.mtc.api.model.entity.BlacklistedToken;
import edu.miu.cs.mtc.api.repository.BlacklistedTokenRepository;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
  private final ConcurrentHashMap<String, LocalDateTime> blacklist = new ConcurrentHashMap<>();

  private final BlacklistedTokenRepository blacklistedTokenRepository;

  public void revokeToken(String token, LocalDateTime expirationTime) {
    BlacklistedToken blacklistedToken = new BlacklistedToken();
    blacklistedToken.setToken(token);
    blacklistedToken.setExpirationTime(expirationTime);
    blacklistedTokenRepository.save(blacklistedToken);
    blacklist.put(token, expirationTime);
  }

  public boolean isTokenRevoked(String token) {
    return blacklist.get(token) != null;
  }

  @Scheduled(cron = "${app.jwt.blacklist.cleanup-scheduled-cron:0 0 * * * *}")
  public void cleanupExpiredTokens() {
    blacklistedTokenRepository.deleteAllByExpirationTimeBefore(LocalDateTime.now());
    blacklist.entrySet().removeIf(entry -> LocalDateTime.now().isAfter(entry.getValue()));
    loadBlacklistedTokens();
  }

  @PostConstruct
  private void loadBlacklistedTokens() {
    blacklistedTokenRepository
        .findAll()
        .forEach(
            blacklistedToken ->
                blacklist.put(blacklistedToken.getToken(), blacklistedToken.getExpirationTime()));
  }
}
