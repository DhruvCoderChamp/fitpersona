package com.fitai.workout.dto;

import lombok.Data;
import java.util.List;

@Data
public class ManualWorkoutPlanRequest {
    private String planName;
    private List<ManualWorkoutDayRequest> days;

    @Data
    public static class ManualWorkoutDayRequest {
        private Integer dayNumber;
        private String muscleGroupLabel;
        private List<ManualWorkoutExerciseRequest> exercises;
    }

    @Data
    public static class ManualWorkoutExerciseRequest {
        private Long exerciseId;
        private Integer sets;
        private Integer reps;
        private Integer restTimeSeconds;
    }
}
