package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.model.dto.CreateCandidateRequest;
import edu.miu.cs.mtc.api.service.CandidateService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidates")
@RequiredArgsConstructor
public class CandidateController {

  private final CandidateService candidateService;

  @PostMapping("/quick-create")
  public ResponseEntity<?> createCandidate(@Valid @RequestBody CreateCandidateRequest request) {
    try {
      var candidateId = candidateService.createCandidate(request);
      var requestUri =
          WebMvcLinkBuilder.linkTo(
                  WebMvcLinkBuilder.methodOn(CandidateController.class).createCandidate(request))
              .toUri();
      var apiUri =
          new URI(
              requestUri.getScheme(),
              requestUri.getAuthority(),
              "/candidates/" + candidateId,
              null,
              null);
      return ResponseEntity.created(apiUri).build();
    } catch (Exception ex) {
      throw new RuntimeException(ex);
    }
  }
}
