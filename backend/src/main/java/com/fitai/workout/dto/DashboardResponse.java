package com.fitai.workout.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private Double bmi;
    private String bmiCategory;
    private Double height;
    private Double weight;
    private Integer totalWorkoutDays;
    private Integer completedDays;
    private Double completionPercentage;
    private Integer estimatedCaloriesBurned;
    private Double waterIntakeLiters;
    private String userName;
}
