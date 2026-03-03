package com.fitai.workout.repository;

import com.fitai.workout.entity.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, Long> {
}
