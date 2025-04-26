package com.upskillhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;
    
    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = StringUtils.getFilenameExtension(fileName);
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;
        
        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid file path sequence " + fileName);
            }
            
            String contentType = file.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("image/")) {
                    validateImage(file);
                } else if (contentType.startsWith("video/")) {
                    validateVideo(file);
                } else {
                    throw new RuntimeException("Unsupported file type: " + contentType);
                }
            }
            
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
    
    private void validateImage(MultipartFile file) {
        // Add image validation logic if needed
        // e.g., check file size, dimensions, etc.
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
            throw new RuntimeException("File size exceeds maximum limit");
        }
    }
    
    private void validateVideo(MultipartFile file) {
        // Add video validation logic
        // e.g., check duration, file size, etc.
        if (file.getSize() > 50 * 1024 * 1024) { // 50MB limit
            throw new RuntimeException("Video size exceeds maximum limit");
        }
        // TODO: Implement video duration check (max 30 seconds)
        // This would require a video processing library
    }
}