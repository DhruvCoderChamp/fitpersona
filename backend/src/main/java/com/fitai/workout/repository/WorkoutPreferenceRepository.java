package com.fitai.workout.repository;

import com.fitai.workout.entity.WorkoutPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WorkoutPreferenceRepository extends JpaRepository<WorkoutPreference, Long> {
    Optional<WorkoutPreference> findTopByUserIdOrderByIdDesc(Long userId);
}
