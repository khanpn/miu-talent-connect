package edu.miu.cs.mtc.api.security;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class PasswordGenerator {

  private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  private static final String DIGITS = "0123456789";
  private static final String SPECIAL_CHARACTERS = "!@#$%^&*()-_+=<>?/";

  private static final String ALL_CHARACTERS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL_CHARACTERS;

  private static final SecureRandom RANDOM = new SecureRandom();

  public String generateRandomPassword(int length) {
    if (length < 4) {
      throw new IllegalArgumentException("Password length must be at least 8 characters");
    }

    // Ensure password contains at least one character from each category
    StringBuilder password = new StringBuilder();
    password.append(getRandomCharacter(UPPERCASE));
    password.append(getRandomCharacter(LOWERCASE));
    password.append(getRandomCharacter(DIGITS));
    password.append(getRandomCharacter(SPECIAL_CHARACTERS));

    // Fill the rest of the password with random characters
    for (int i = 4; i < length; i++) {
      password.append(getRandomCharacter(ALL_CHARACTERS));
    }

    // Shuffle the characters to avoid predictable patterns
    return shuffleString(password.toString());
  }

  private char getRandomCharacter(String characters) {
    return characters.charAt(RANDOM.nextInt(characters.length()));
  }

  private String shuffleString(String input) {
    List<Character> characters = new ArrayList<>();
    for (char c : input.toCharArray()) {
      characters.add(c);
    }
    Collections.shuffle(characters, RANDOM);
    StringBuilder result = new StringBuilder();
    for (char c : characters) {
      result.append(c);
    }
    return result.toString();
  }
}
