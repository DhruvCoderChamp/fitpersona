package com.fitai.workout.controller;

import com.fitai.workout.dto.*;
import com.fitai.workout.service.WorkoutEngineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutEngineService workoutEngineService;

    @PostMapping("/preferences")
    public ResponseEntity<?> savePreferences(Authentication auth,
            @Valid @RequestBody WorkoutPreferenceRequest request) {
        workoutEngineService.savePreference(auth.getName(), request);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Preferences saved successfully"));
    }

    @PostMapping("/generate")
    public ResponseEntity<WorkoutPlanResponse> generatePlan(Authentication auth) {
        return ResponseEntity.ok(workoutEngineService.generatePlan(auth.getName()));
    }

    @GetMapping("/plan")
    public ResponseEntity<WorkoutPlanResponse> getLatestPlan(Authentication auth) {
        return ResponseEntity.ok(workoutEngineService.getLatestPlan(auth.getName()));
    }

    @GetMapping("/plans")
    public ResponseEntity<List<WorkoutPlanResponse>> getAllPlans(Authentication auth) {
        return ResponseEntity.ok(workoutEngineService.getAllPlans(auth.getName()));
    }

    @PutMapping("/day/{dayId}/toggle")
    public ResponseEntity<?> toggleDay(@PathVariable Long dayId) {
        workoutEngineService.toggleDayCompletion(dayId);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Day toggled"));
    }
}
