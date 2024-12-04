package edu.miu.cs.mtc.api.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HeaderCheckController {

  @GetMapping("/check-headers")
  public Map<String, String> checkHeaders(@RequestHeader Map<String, String> headers) {
    return headers;
  }
}
