package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.service.SearchDataSynchronizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search-data")
@RequiredArgsConstructor
public class SearchDataSynchronizationController {

  private final SearchDataSynchronizationService searchDataSynchronizationService;

  @PostMapping("/sync")
  public ResponseEntity<Void> syncSearchData() {
    searchDataSynchronizationService.synchronizeData();
    return ResponseEntity.noContent().build();
  }
}
