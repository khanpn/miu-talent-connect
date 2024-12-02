package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.aop.OwnershipCheck;
import edu.miu.cs.mtc.api.model.entity.CandidateProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

@OwnershipCheck
public interface CandidateProfileRepository extends MongoRepository<CandidateProfile, String> {}
