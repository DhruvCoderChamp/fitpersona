package com.fitai.workout.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietPlanRequest {

    public enum ActivityLevel {
        SEDENTARY, MODERATE, ACTIVE
    }

    public enum DietGoal {
        FAT_LOSS, WEIGHT_GAIN, MUSCLE_GAIN, MAINTENANCE
    }

    @NotNull
    @Min(10)
    @Max(100)
    private Integer age;

    @NotNull
    private String gender; // "male" or "female"

    @NotNull
    @Min(100)
    @Max(250)
    private Double height; // cm

    @NotNull
    @Min(30)
    @Max(300)
    private Double weight; // kg

    @NotNull
    private ActivityLevel activityLevel;

    @NotNull
    private DietGoal goal;
}
