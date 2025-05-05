package com.freelanceproject.authorization_authentication.controllers;

import com.freelanceproject.authorization_authentication.model.LoginRequestDTO;
import com.freelanceproject.authorization_authentication.model.LoginResponseDTO;
import com.freelanceproject.authorization_authentication.model.UserEntity;
import com.freelanceproject.authorization_authentication.repository.UserRepository;
import com.freelanceproject.authorization_authentication.service.FileStorageService;
import com.freelanceproject.authorization_authentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")

public class UserFileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.upload-dir}")
    private String imageUploadDir;

    @PostMapping("/{userId}/image")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {
            // Validate user exists
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate file is not empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Validate file is an image (optional)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // Generate safe filename (prevent path traversal)
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(imageUploadDir);

            // Save file to disk
            Path filePath = uploadPath.resolve(filename).normalize();
            file.transferTo(filePath);

            // Update user entity with image filename
            user.setImageFilename(filename);
            userRepository.save(user);
            LoginRequestDTO responseDTO = new LoginRequestDTO("Image uploaded successfully: ", filename);
            return ResponseEntity.ok(responseDTO);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload image");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/image")
    public ResponseEntity<Resource> downloadImage(@PathVariable Long userId) {
        try {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getImageFilename() == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(imageUploadDir)
                    .resolve(user.getImageFilename())
                    .normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // Determine content type dynamically
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{userId}/cv")
    public ResponseEntity<String> uploadCV(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {
            UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));;

            // Delete old file if exists
            if (user.getCvFilename() != null) {
                fileStorageService.deleteFile(user.getCvFilename());
            }

            // Store new file
            String filename = fileStorageService.storeFile(file);

            // Update user entity
            user.setCvFilename(filename);
            userRepository.save(user);

            return ResponseEntity.ok("CV uploaded successfully: " + filename);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload CV: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/cv")
    public ResponseEntity<Resource> downloadCV(@PathVariable Long userId) {
        try {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getCvFilename() == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(uploadDir).resolve(user.getCvFilename()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{userId}/cv")
    public ResponseEntity<String> deleteCV(@PathVariable Long userId) {
        try {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getCvFilename() != null) {
                fileStorageService.deleteFile(user.getCvFilename());
                user.setCvFilename(null);
                userRepository.save(user);
            }

            return ResponseEntity.ok("CV deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete CV: " + e.getMessage());
        }
    }
}
