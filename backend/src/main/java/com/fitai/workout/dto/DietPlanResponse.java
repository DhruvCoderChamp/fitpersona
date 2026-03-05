package com.fitai.workout.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlanResponse {

    private int dailyCalories;
    private int proteinGrams;
    private int carbsGrams;
    private int fatsGrams;
    private String goal;
    private List<DietDayResponse> days;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DietDayResponse {
        private int dayNumber;
        private String dayName;
        private List<MealResponse> meals;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MealResponse {
        private String mealType;
        private String description;
        private int calories;
        private List<String> items;
    }
}
