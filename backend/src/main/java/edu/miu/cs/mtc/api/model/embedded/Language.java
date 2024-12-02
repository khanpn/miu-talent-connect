package edu.miu.cs.mtc.api.model.embedded;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Language {

  @NotNull(message = "{Language.name.NotNull}")
  @Size(min = 1, max = 20, message = "{Language.name.Size}")
  private String name;

  private LanguageProficiencyLevel speakingLevel;
  private LanguageProficiencyLevel readingLevel;
  private LanguageProficiencyLevel listeningLevel;
  private LanguageProficiencyLevel writingLevel;
}
