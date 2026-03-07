package com.fitai.workout.controller;

import com.fitai.workout.dto.UserProgressRequest;
import com.fitai.workout.dto.UserProgressResponse;
import com.fitai.workout.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {
    private final UserProgressService userProgressService;

    @PostMapping
    public ResponseEntity<UserProgressResponse> logProgress(Authentication authentication,
            @RequestBody UserProgressRequest request) {
        return ResponseEntity.ok(userProgressService.logProgress(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<UserProgressResponse>> getProgress(Authentication authentication) {
        return ResponseEntity.ok(userProgressService.getProgress(authentication.getName()));
    }
}
