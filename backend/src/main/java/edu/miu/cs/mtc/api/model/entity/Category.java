package edu.miu.cs.mtc.api.model.entity;

import edu.miu.cs.mtc.api.model.enums.CategoryType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@EqualsAndHashCode(callSuper = true)
@Data
public class Category extends Auditable {
  @Id private String id;
  private String name;
  private CategoryType type;
}
