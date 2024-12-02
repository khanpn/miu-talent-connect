package edu.miu.cs.mtc.api.service;

import java.io.IOException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
@RequiredArgsConstructor
public class S3FileUploadService implements FileUploadService {
  private static final String S3_ACCESS_URL_TEMPLATE = "https://%s.s3.%s.amazonaws.com/%s";

  @Value("${aws.region}")
  private String region;

  @Value("${aws.s3.bucket}")
  private String bucket;

  private final S3Client s3Client;

  public String uploadFile(MultipartFile file, String... folders) {
    var fileName =
        Optional.ofNullable(file.getOriginalFilename())
            .orElse(String.valueOf(System.currentTimeMillis()));
    var folder = "";
    if (folders != null) {
      folder = String.join("/", folders);
    }
    var key = folder.isBlank() ? fileName : String.join("/", folder, fileName);
    try {
      s3Client.putObject(
          PutObjectRequest.builder()
              .bucket(bucket)
              .contentType(file.getContentType())
              .key(key)
              .build(),
          RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
    } catch (S3Exception | IOException e) {
      throw new RuntimeException("Failed to upload file to S3", e);
    }

    return String.format(S3_ACCESS_URL_TEMPLATE, bucket, region, key);
  }
}
