package com.fitai.workout.dto;

import com.fitai.workout.entity.Exercise;
import com.fitai.workout.entity.WorkoutPreference;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPreferenceRequest {
    @NotNull
    private WorkoutPreference.FitnessLevel level;

    @NotNull
    private WorkoutPreference.Goal goal;

    @NotNull
    @Min(3)
    @Max(6)
    private Integer daysPerWeek;

    @NotNull
    private Exercise.Equipment equipment;

    @NotEmpty
    private List<Exercise.MuscleGroup> targetMuscleGroups;
}
