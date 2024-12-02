package edu.miu.cs.mtc.api.model.search;

import edu.miu.cs.mtc.api.model.entity.Category;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CategoryFilter extends Category {
  private Integer candidateCount;
}
