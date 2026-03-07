package com.fitai.workout.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserProgressRequest {
    private Double weight;
    private Integer caloriesBurned;
    private Integer workoutsCompleted;
    private LocalDate date;
}
