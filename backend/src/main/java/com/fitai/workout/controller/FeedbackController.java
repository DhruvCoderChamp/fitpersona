package com.fitai.workout.controller;

import com.fitai.workout.dto.FeedbackRequest;
import com.fitai.workout.entity.Feedback;
import com.fitai.workout.entity.User;
import com.fitai.workout.repository.FeedbackRepository;
import com.fitai.workout.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> submitFeedback(
            Authentication auth,
            @Valid @RequestBody FeedbackRequest request) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = Feedback.builder()
                .user(user)
                .category(request.getCategory())
                .message(request.getMessage())
                .rating(request.getRating())
                .build();

        feedbackRepository.save(feedback);

        return ResponseEntity.ok(Map.of(
                "message", "Thank you for your feedback! We appreciate it 🙏",
                "id", feedback.getId() != null ? feedback.getId() : 0
        ));
    }
}
