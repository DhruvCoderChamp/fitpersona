package com.fitai.workout.service;

import com.fitai.workout.dto.ExerciseRequest;
import com.fitai.workout.entity.Exercise;
import com.fitai.workout.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public List<Exercise> getByMuscleGroup(Exercise.MuscleGroup muscleGroup) {
        return exerciseRepository.findByMuscleGroup(muscleGroup);
    }

    public Exercise createExercise(ExerciseRequest request) {
        Exercise exercise = Exercise.builder()
                .name(request.getName())
                .muscleGroup(request.getMuscleGroup())
                .difficulty(request.getDifficulty())
                .equipment(request.getEquipment())
                .description(request.getDescription())
                .defaultSets(request.getDefaultSets() != null ? request.getDefaultSets() : 3)
                .defaultReps(request.getDefaultReps() != null ? request.getDefaultReps() : 10)
                .defaultRestSeconds(request.getDefaultRestSeconds() != null ? request.getDefaultRestSeconds() : 60)
                .gifUrl(request.getGifUrl())
                .build();
        return exerciseRepository.save(exercise);
    }

    public Exercise updateExercise(Long id, ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setName(request.getName());
        exercise.setMuscleGroup(request.getMuscleGroup());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setEquipment(request.getEquipment());
        exercise.setDescription(request.getDescription());
        exercise.setDefaultSets(request.getDefaultSets());
        exercise.setDefaultReps(request.getDefaultReps());
        exercise.setDefaultRestSeconds(request.getDefaultRestSeconds());
        exercise.setGifUrl(request.getGifUrl());

        return exerciseRepository.save(exercise);
    }

    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }
}
