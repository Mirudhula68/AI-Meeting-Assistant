package com.meetingassistant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    private static final String UPLOAD_DIR = "D:\\ai-meeting-assistant\\backend-java\\uploads\\";

    @PostMapping("/upload")
    public String uploadAudio(@RequestParam("file") MultipartFile file) {

        try {
            // Create uploads folder if not exists
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save file
            String filePath = UPLOAD_DIR + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            return "File uploaded successfully: " + filePath;

        } catch (IOException e) {
            e.printStackTrace(); // 👈 ADD THIS
            return "Upload failed: " + e.getMessage();
        }
    }
}