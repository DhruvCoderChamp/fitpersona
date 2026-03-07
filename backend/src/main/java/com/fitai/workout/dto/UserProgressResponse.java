package com.fitai.workout.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class UserProgressResponse {
    private Long id;
    private Double weight;
    private Integer caloriesBurned;
    private Integer workoutsCompleted;
    private LocalDate date;
}
