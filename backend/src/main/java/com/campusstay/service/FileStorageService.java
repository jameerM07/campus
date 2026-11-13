package com.campusstay.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${app.upload.dir:./uploads/}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // Check if filename contains invalid characters
        if (originalFilename.contains("..")) {
            throw new RuntimeException("Filename contains invalid path sequence " + originalFilename);
        }

        // Generate unique filename to avoid collision
        String fileExtension = "";
        int extensionIndex = originalFilename.lastIndexOf(".");
        if (extensionIndex > 0) {
            fileExtension = originalFilename.substring(extensionIndex);
        }
        String fileName = UUID.randomUUID() + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/api/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Path loadFileAsResource(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}

