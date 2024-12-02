package edu.miu.cs.mtc.api.model.enums;

import lombok.Getter;

@Getter
public enum Pronoun {
  HE_HIM_HIS("He/Him/His"),
  SHE_HER_HERS("She/Her/Hers"),
  THEY_THEM_THEIRS("They/Them/Theirs"),
  OTHER("Other");

  private final String displayName;

  Pronoun(String displayName) {
    this.displayName = displayName;
  }
}
