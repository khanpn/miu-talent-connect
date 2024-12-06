package edu.miu.cs.mtc.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

class S3FileUploadServiceTest {

  @InjectMocks private S3FileUploadService s3FileUploadService;

  @Mock private S3Client s3Client;

  @Mock private MultipartFile multipartFile;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    s3FileUploadService = new S3FileUploadService(s3Client);
    s3FileUploadService.setRegion("us-east-1");
    s3FileUploadService.setBucket("test-bucket");
  }

  @Test
  void uploadFile() throws IOException {
    byte[] fileContent = "Test file content".getBytes();
    when(multipartFile.getOriginalFilename()).thenReturn("test-file.txt");
    when(multipartFile.getContentType()).thenReturn("text/plain");
    when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(fileContent));
    when(multipartFile.getSize()).thenReturn((long) fileContent.length);

    // Act
    String result = s3FileUploadService.uploadFile(multipartFile, "folder1", "folder2");

    // Assert
    String expectedKey = "folder1/folder2/test-file.txt";
    String expectedUrl = "https://test-bucket.s3.us-east-1.amazonaws.com/" + expectedKey;

    assertEquals(expectedUrl, result);

    // Verify S3Client interaction
    verify(s3Client)
        .putObject(
            eq(
                PutObjectRequest.builder()
                    .bucket("test-bucket")
                    .contentType("text/plain")
                    .key(expectedKey)
                    .build()),
            any(RequestBody.class));
  }

  @Test
  void testUploadFileWithNoFolders() throws IOException {
    // Arrange
    byte[] fileContent = "Test file content".getBytes();
    when(multipartFile.getOriginalFilename()).thenReturn("test-file.txt");
    when(multipartFile.getContentType()).thenReturn("text/plain");
    when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(fileContent));
    when(multipartFile.getSize()).thenReturn((long) fileContent.length);

    // Act
    String result = s3FileUploadService.uploadFile(multipartFile);

    // Assert
    String expectedKey = "test-file.txt";
    String expectedUrl = "https://test-bucket.s3.us-east-1.amazonaws.com/" + expectedKey;

    assertEquals(expectedUrl, result);

    // Verify S3Client interaction
    verify(s3Client)
        .putObject(
            eq(
                PutObjectRequest.builder()
                    .bucket("test-bucket")
                    .contentType("text/plain")
                    .key(expectedKey)
                    .build()),
            any(RequestBody.class));
  }

  @Test
  void testUploadFileThrowsIOException() throws IOException {
    // Arrange
    when(multipartFile.getOriginalFilename()).thenReturn("test-file.txt");
    when(multipartFile.getContentType()).thenReturn("text/plain");
    when(multipartFile.getInputStream()).thenThrow(new IOException("Failed to read file"));

    // Act & Assert
    RuntimeException exception =
        assertThrows(
            RuntimeException.class,
            () -> {
              s3FileUploadService.uploadFile(multipartFile, "folder1");
            });

    assertEquals("Failed to upload file to S3", exception.getMessage());
    verifyNoInteractions(s3Client);
  }

  @Test
  void testUploadFileThrowsS3Exception() throws IOException {
    // Arrange
    byte[] fileContent = "Test file content".getBytes();
    when(multipartFile.getOriginalFilename()).thenReturn("test-file.txt");
    when(multipartFile.getContentType()).thenReturn("text/plain");
    when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(fileContent));
    when(multipartFile.getSize()).thenReturn((long) fileContent.length);

    doThrow(new RuntimeException("S3 exception"))
        .when(s3Client)
        .putObject(any(PutObjectRequest.class), any(RequestBody.class));

    // Act & Assert
    RuntimeException exception =
        assertThrows(
            RuntimeException.class,
            () -> {
              s3FileUploadService.uploadFile(multipartFile, "folder1");
            });

    assertEquals("S3 exception", exception.getMessage());
  }
}
