package com.fitai.workout.controller;

import com.fitai.workout.dto.ExerciseRequest;
import com.fitai.workout.entity.Exercise;
import com.fitai.workout.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<Exercise>> getAll() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    @GetMapping("/muscle/{muscleGroup}")
    public ResponseEntity<List<Exercise>> getByMuscle(@PathVariable Exercise.MuscleGroup muscleGroup) {
        return ResponseEntity.ok(exerciseService.getByMuscleGroup(muscleGroup));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exercise> create(@Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.createExercise(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exercise> update(@PathVariable Long id, @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Exercise deleted"));
    }
}
