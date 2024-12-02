package edu.miu.cs.mtc.api.model.entity;

import java.time.Instant;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public abstract class Auditable {

  @CreatedDate
  @Field("created_date")
  private Instant createdDate;

  @LastModifiedDate
  @Field("last_modified_date")
  private Instant lastModifiedDate;

  @CreatedBy
  @Field("created_by")
  private String createdBy;

  @Field("owner")
  private String owner;

  @LastModifiedBy
  @Field("last_modified_by")
  private String lastModifiedBy;

  public String getOwner() {
    if (owner == null) return createdBy;
    return owner;
  }
}
