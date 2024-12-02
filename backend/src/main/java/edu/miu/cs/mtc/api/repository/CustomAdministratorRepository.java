package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.model.entity.Administrator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomAdministratorRepository {
  Page<Administrator> findAllWithPagination(Pageable pageable);
}
