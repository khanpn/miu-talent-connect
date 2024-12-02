package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.aop.OwnershipCheck;
import edu.miu.cs.mtc.api.model.entity.Employer;
import org.springframework.data.mongodb.repository.MongoRepository;

@OwnershipCheck
public interface EmployerRepository extends MongoRepository<Employer, String> {}
