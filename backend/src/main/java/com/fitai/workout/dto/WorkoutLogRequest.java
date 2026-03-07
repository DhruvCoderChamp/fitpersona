package com.fitai.workout.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
public class WorkoutLogRequest {
    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Workout day ID can be null if adhoc but typically provided")
    private Long workoutDayId;

    @NotNull(message = "Exercise ID is required")
    private Long exerciseId;

    @NotNull(message = "Sets are required")
    private List<SetLogRequest> sets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SetLogRequest {
        @NotNull
        @Min(1)
        private Integer setNumber;

        @NotNull
        @Min(1)
        private Integer reps;

        @NotNull
        @Min(0)
        private Double weightLifted;
    }
}
