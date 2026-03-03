package com.fitai.workout.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlanResponse {
    private Long id;
    private String planName;
    private LocalDate generatedDate;
    private String warmupSuggestion;
    private String cooldownSuggestion;
    private List<WorkoutDayResponse> days;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkoutDayResponse {
        private Long id;
        private Integer dayNumber;
        private String muscleGroupLabel;
        private Boolean completed;
        private List<WorkoutExerciseResponse> exercises;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkoutExerciseResponse {
        private Long id;
        private String exerciseName;
        private String muscleGroup;
        private String difficulty;
        private String description;
        private Integer sets;
        private Integer reps;
        private Integer restTimeSeconds;
    }
}
