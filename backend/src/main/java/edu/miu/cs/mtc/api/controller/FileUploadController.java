package edu.miu.cs.mtc.api.controller;

import edu.miu.cs.mtc.api.service.FileUploadService;
import edu.miu.cs.mtc.api.util.AuthUtils;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileUploadController {
  private static final String AVATARS = "avatars";
  private static final String RESUMES = "resumes";

  private final FileUploadService fileUploadService;

  @PostMapping("/avatars")
  public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
    var foldersOpt =
        AuthUtils.getCurrentUsername()
            .map(username -> String.join("/", AVATARS, username))
            .or(() -> Optional.of(AVATARS));
    String fileUrl = fileUploadService.uploadFile(file, foldersOpt.get());
    return ResponseEntity.ok(fileUrl);
  }

  @PostMapping("/resumes")
  public ResponseEntity<String> uploadResumeFile(@RequestParam("file") MultipartFile file) {
    var foldersOpt =
        AuthUtils.getCurrentUsername()
            .map(username -> String.join("/", RESUMES, username))
            .or(() -> Optional.of(RESUMES));
    String fileUrl = fileUploadService.uploadFile(file, foldersOpt.get());
    return ResponseEntity.ok(fileUrl);
  }
}
