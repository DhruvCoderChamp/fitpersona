package com.fitai.workout.repository;

import com.fitai.workout.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByUserIdOrderByGeneratedDateDesc(Long userId);
    Optional<WorkoutPlan> findTopByUserIdOrderByGeneratedDateDesc(Long userId);
}
