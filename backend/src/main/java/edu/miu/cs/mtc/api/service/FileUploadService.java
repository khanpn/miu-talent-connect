package edu.miu.cs.mtc.api.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

  String uploadFile(MultipartFile file, String... folders);
}
