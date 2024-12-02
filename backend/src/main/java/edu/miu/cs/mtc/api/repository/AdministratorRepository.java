package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.aop.OwnershipCheck;
import edu.miu.cs.mtc.api.model.entity.Administrator;
import org.springframework.data.mongodb.repository.MongoRepository;

@OwnershipCheck
public interface AdministratorRepository
    extends MongoRepository<Administrator, String>, CustomAdministratorRepository {}
