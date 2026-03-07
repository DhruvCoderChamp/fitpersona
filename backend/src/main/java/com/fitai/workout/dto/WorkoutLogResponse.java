package com.fitai.workout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLogResponse {
    private String exerciseName;
    private Long exerciseId;
    private LocalDate date;
    private List<SetLogResponse> sets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SetLogResponse {
        private Long id;
        private Integer setNumber;
        private Integer reps;
        private Double weightLifted;
        private Boolean isPersonalRecord;
    }
}
