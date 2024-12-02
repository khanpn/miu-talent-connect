package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.model.dto.CreateEmployerRequest;
import edu.miu.cs.mtc.api.service.EmployerService;
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
@RequestMapping("/employers")
@RequiredArgsConstructor
public class EmployerController {

  private final EmployerService employerService;

  @PostMapping("/quick-create")
  public ResponseEntity<?> createEmployer(@Valid @RequestBody CreateEmployerRequest request) {
    try {
      var employerId = employerService.createEmployer(request);
      var requestUri =
          WebMvcLinkBuilder.linkTo(
                  WebMvcLinkBuilder.methodOn(EmployerController.class).createEmployer(request))
              .toUri();
      var apiUri =
          new URI(
              requestUri.getScheme(),
              requestUri.getAuthority(),
              "/employers/" + employerId,
              null,
              null);
      return ResponseEntity.created(apiUri).build();
    } catch (Exception ex) {
      throw new RuntimeException(ex);
    }
  }
}
