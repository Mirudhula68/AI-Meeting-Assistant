package com.meetingassistant.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    private static final Logger logger = LoggerFactory.getLogger(AudioController.class);
    private final WebClient webClient;

    public AudioController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    @PostMapping("/upload")
    public String uploadAudio(@RequestParam("file") MultipartFile file) {
        logger.info("Received upload request for file: {}", file.getOriginalFilename());

        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", file.getResource());
            MultiValueMap<String, HttpEntity<?>> multipartBody = builder.build();

            return webClient.post()
                    .uri("/api/audio/process-audio")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(multipartBody))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Simple blocking for now to match synchronous controller

        } catch (Exception e) {
            logger.error("Failed to proxy request to ML service: {}", e.getMessage(), e);
            return "{\"error\": \"Gateway Error: " + e.getMessage() + "\"}";
        }
    }
}