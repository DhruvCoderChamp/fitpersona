package com.fitai.workout.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${aws.enabled:false}")
    private boolean awsEnabled;

    @Value("${aws.accessKey:}")
    private String accessKey;

    @Value("${aws.secretKey:}")
    private String secretKey;

    @Value("${aws.region:ap-south-1}")
    private String region;

    @Value("${aws.bucket:fitpersona-storage}")
    private String bucket;

    // Local fallback path (used in dev)
    private final Path localStorageLocation;

    public FileStorageService() {
        this.localStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.localStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create local uploads directory.", ex);
        }
    }

    /**
     * Stores the given multipart file.
     * In production (aws.enabled=true) → uploads to S3 and returns the public HTTPS URL.
     * In development (aws.enabled=false) → saves locally and returns /uploads/<filename>.
     */
    public String storeFile(MultipartFile file) {
        String extension = "";
        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String newFileName = UUID.randomUUID() + extension;

        if (newFileName.contains("..")) {
            throw new RuntimeException("Filename contains invalid path sequence: " + newFileName);
        }

        if (awsEnabled) {
            return uploadToS3(file, newFileName);
        } else {
            return saveLocally(file, newFileName);
        }
    }

    // ── S3 Upload ────────────────────────────────────────────────────────────

    private String uploadToS3(MultipartFile file, String keyName) {
        try {
            S3Client s3 = buildS3Client();

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key("progress-photos/" + keyName)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    // Objects are publicly readable via bucket policy; no ACL needed
                    .build();

            s3.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Return the public S3 URL
            return String.format("https://%s.s3.%s.amazonaws.com/progress-photos/%s",
                    bucket, region, keyName);

        } catch (IOException ex) {
            throw new RuntimeException("Could not upload file to S3: " + keyName, ex);
        }
    }

    private S3Client buildS3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }

    // ── Local Fallback ───────────────────────────────────────────────────────

    private String saveLocally(MultipartFile file, String newFileName) {
        try {
            Path targetLocation = this.localStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file locally: " + newFileName, ex);
        }
    }
}
