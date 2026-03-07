package com.fitai.workout.service;

import com.fitai.workout.dto.UserProgressRequest;
import com.fitai.workout.dto.UserProgressResponse;
import com.fitai.workout.entity.User;
import com.fitai.workout.entity.UserProgress;
import com.fitai.workout.repository.UserProgressRepository;
import com.fitai.workout.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    @Transactional
    public UserProgressResponse logProgress(String email, UserProgressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProgress progress = UserProgress.builder()
                .user(user)
                .weight(request.getWeight())
                .caloriesBurned(request.getCaloriesBurned())
                .workoutsCompleted(request.getWorkoutsCompleted())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .build();

        progress = userProgressRepository.save(progress);
        return mapToResponse(progress);
    }

    public List<UserProgressResponse> getProgress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProgressRepository.findByUserIdOrderByDateAsc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserProgressResponse mapToResponse(UserProgress progress) {
        return UserProgressResponse.builder()
                .id(progress.getId())
                .weight(progress.getWeight())
                .caloriesBurned(progress.getCaloriesBurned())
                .workoutsCompleted(progress.getWorkoutsCompleted())
                .date(progress.getDate())
                .build();
    }
}
