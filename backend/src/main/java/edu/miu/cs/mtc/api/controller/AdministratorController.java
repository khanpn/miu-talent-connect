package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.model.dto.CreateAdminUserRequest;
import edu.miu.cs.mtc.api.service.AdminUserService;
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
@RequestMapping("/administrators")
@RequiredArgsConstructor
public class AdministratorController {

  private final AdminUserService adminUserService;

  @PostMapping("/quick-create")
  public ResponseEntity<?> createAdminUser(@Valid @RequestBody CreateAdminUserRequest request) {
    try {
      var adminUserId = adminUserService.createAdminUser(request);
      var requestUri =
          WebMvcLinkBuilder.linkTo(
                  WebMvcLinkBuilder.methodOn(AdministratorController.class)
                      .createAdminUser(request))
              .toUri();
      var apiUri =
          new URI(
              requestUri.getScheme(),
              requestUri.getAuthority(),
              "/administrators/" + adminUserId,
              null,
              null);
      return ResponseEntity.created(apiUri).build();
    } catch (Exception ex) {
      throw new RuntimeException(ex);
    }
  }
}
