package com.fitai.workout.controller;

import com.fitai.workout.dto.DietPlanRequest;
import com.fitai.workout.dto.DietPlanResponse;
import com.fitai.workout.service.DietPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietPlanService dietPlanService;

    @PostMapping("/generate")
    public ResponseEntity<DietPlanResponse> generateDietPlan(
            Authentication auth,
            @Valid @RequestBody DietPlanRequest request) {
        DietPlanResponse plan = dietPlanService.generateDietPlan(request);
        return ResponseEntity.ok(plan);
    }
}
