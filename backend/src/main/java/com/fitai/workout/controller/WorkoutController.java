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
    private final com.fitai.workout.service.WorkoutLogService workoutLogService;

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

    @PostMapping("/manual")
    public ResponseEntity<WorkoutPlanResponse> createManualPlan(Authentication auth,
            @RequestBody ManualWorkoutPlanRequest request) {
        return ResponseEntity.ok(workoutEngineService.createManualPlan(auth.getName(), request));
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
    public ResponseEntity<?> toggleDay(@PathVariable("dayId") Long dayId) {
        workoutEngineService.toggleDayCompletion(dayId);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Day toggled"));
    }

    @PostMapping("/log")
    public ResponseEntity<WorkoutLogResponse> logWorkout(
            Authentication auth,
            @Valid @RequestBody WorkoutLogRequest request) {
        return ResponseEntity.ok(workoutLogService.logWorkout(auth.getName(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutLogResponse>> getHistory(
            Authentication auth,
            @RequestParam("date") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        return ResponseEntity.ok(workoutLogService.getWorkoutHistoryByDate(auth.getName(), date));
    }

    @GetMapping("/progress/{exerciseId}")
    public ResponseEntity<List<WorkoutLogResponse>> getProgress(
            Authentication auth,
            @PathVariable("exerciseId") Long exerciseId) {
        return ResponseEntity.ok(workoutLogService.getExerciseProgress(auth.getName(), exerciseId));
    }

    @GetMapping("/dates")
    public ResponseEntity<List<java.time.LocalDate>> getWorkoutDates(Authentication auth) {
        return ResponseEntity.ok(workoutLogService.getWorkoutDates(auth.getName()));
    }
}
