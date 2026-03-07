package com.fitai.workout.controller;

import com.fitai.workout.dto.ProgressPhotoResponse;
import com.fitai.workout.entity.ProgressPhoto;
import com.fitai.workout.entity.User;
import com.fitai.workout.repository.ProgressPhotoRepository;
import com.fitai.workout.repository.UserRepository;
import com.fitai.workout.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress/photos")
@RequiredArgsConstructor
public class ProgressPhotoController {

    private final FileStorageService fileStorageService;
    private final ProgressPhotoRepository progressPhotoRepository;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<ProgressPhotoResponse> uploadPhoto(
            Authentication auth,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "notes", required = false) String notes) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String photoUrl = fileStorageService.storeFile(file);

        ProgressPhoto progressPhoto = ProgressPhoto.builder()
                .user(user)
                .photoUrl(photoUrl)
                .notes(notes)
                .build();

        progressPhoto = progressPhotoRepository.save(progressPhoto);

        return ResponseEntity.ok(mapToResponse(progressPhoto));
    }

    @GetMapping
    public ResponseEntity<List<ProgressPhotoResponse>> getPhotos(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ProgressPhoto> photos = progressPhotoRepository.findByUserIdOrderByUploadDateDesc(user.getId());

        return ResponseEntity.ok(photos.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    private ProgressPhotoResponse mapToResponse(ProgressPhoto photo) {
        return ProgressPhotoResponse.builder()
                .id(photo.getId())
                .photoUrl(photo.getPhotoUrl())
                .notes(photo.getNotes())
                .uploadDate(photo.getUploadDate())
                .build();
    }
}
