package edu.miu.cs.mtc.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableMongoAuditing
@EnableCaching
@EnableScheduling
public class MIUTalentConnectApisApplication {

  public static void main(String[] args) {
    SpringApplication.run(MIUTalentConnectApisApplication.class, args);
  }
}
