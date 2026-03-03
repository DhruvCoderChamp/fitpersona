package com.fitai.workout.dto;

import com.fitai.workout.entity.Exercise;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {
    @NotBlank
    private String name;

    @NotNull
    private Exercise.MuscleGroup muscleGroup;

    @NotNull
    private Exercise.Difficulty difficulty;

    @NotNull
    private Exercise.Equipment equipment;

    private String description;
    private Integer defaultSets;
    private Integer defaultReps;
    private Integer defaultRestSeconds;
}
