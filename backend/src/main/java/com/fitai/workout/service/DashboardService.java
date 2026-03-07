package com.fitai.workout.service;

import com.fitai.workout.dto.DashboardResponse;
import com.fitai.workout.entity.*;
import com.fitai.workout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double bmi = 0;
        String bmiCategory = "N/A";

        if (user.getHeight() != null && user.getWeight() != null && user.getHeight() > 0) {
            double heightM = user.getHeight() / 100.0;
            bmi = Math.round((user.getWeight() / (heightM * heightM)) * 10.0) / 10.0;
            bmiCategory = getBmiCategory(bmi);
        }

        int totalDays = 0;
        int completedDays = 0;
        int estimatedCalories = 0;

        var latestPlan = workoutPlanRepository.findTopByUserIdOrderByIdDesc(user.getId());
        if (latestPlan.isPresent()) {
            WorkoutPlan plan = latestPlan.get();
            totalDays = plan.getWorkoutDays().size();
            completedDays = (int) plan.getWorkoutDays().stream().filter(WorkoutDay::getCompleted).count();
            estimatedCalories = completedDays * getCaloriesPerSession(user.getWeight());
        }

        double completion = totalDays > 0 ? Math.round((completedDays * 100.0 / totalDays) * 10.0) / 10.0 : 0;

        // Water intake recommendation based on weight
        double waterIntake = user.getWeight() != null ? Math.round(user.getWeight() * 0.033 * 10.0) / 10.0 : 2.5;

        return DashboardResponse.builder()
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .height(user.getHeight())
                .weight(user.getWeight())
                .totalWorkoutDays(totalDays)
                .completedDays(completedDays)
                .completionPercentage(completion)
                .estimatedCaloriesBurned(estimatedCalories)
                .waterIntakeLiters(waterIntake)
                .userName(user.getName())
                .build();
    }

    private String getBmiCategory(double bmi) {
        if (bmi < 18.5)
            return "Underweight";
        if (bmi < 25.0)
            return "Normal";
        if (bmi < 30.0)
            return "Overweight";
        return "Obese";
    }

    private int getCaloriesPerSession(Double weight) {
        if (weight == null)
            return 300;
        // Rough estimate: 5-7 calories per minute of weight training * 45 min avg
        return (int) (weight * 0.1 * 45);
    }
}
