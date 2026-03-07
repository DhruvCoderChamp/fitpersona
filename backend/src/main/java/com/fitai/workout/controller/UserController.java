package com.fitai.workout.controller;

import com.fitai.workout.dto.UserProfileResponse;
import com.fitai.workout.dto.UserProfileUpdateRequest;
import com.fitai.workout.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication auth,
            @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), request));
    }
}
