package edu.miu.cs.mtc.api.repository;

import edu.miu.cs.mtc.api.model.search.CandidateSearch;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomCandidateRepository {
  Page<CandidateSearch> findAllByCriteria(
      List<String> categories, List<String> searchTerms, Pageable pageable);
}
