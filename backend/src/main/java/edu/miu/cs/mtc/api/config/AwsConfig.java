package edu.miu.cs.mtc.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

  @Value("${aws.accessKeyId}")
  private String accessKeyId;

  @Value("${aws.secretKey}")
  private String secretKey;

  @Value("${aws.region}")
  private String region;

  @Bean
  public AwsBasicCredentials awsBasicCredentials() {
    return AwsBasicCredentials.create(accessKeyId, secretKey);
  }

  @Bean
  public AwsCredentialsProvider staticCredentialsProvider() {
    AwsBasicCredentials awsBasicCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);
    return StaticCredentialsProvider.create(awsBasicCredentials);
  }

  @Bean
  public S3Client s3Client(AwsCredentialsProvider credentialsProvider) {
    return S3Client.builder()
        .region(Region.of(region))
        .credentialsProvider(credentialsProvider)
        .build();
  }
}
