package com.upskillhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class UpSkillHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(UpSkillHubApplication.class, args);
    }
}