package com.fitai.workout.repository;

import com.fitai.workout.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {

    List<WorkoutLog> findByUserIdAndDateOrderBySetNumberAsc(Long userId, LocalDate date);

    List<WorkoutLog> findByUserIdAndExerciseIdOrderByDateAscSetNumberAsc(Long userId, Long exerciseId);

    @Query("SELECT MAX(w.weightLifted) FROM WorkoutLog w WHERE w.user.id = :userId AND w.exercise.id = :exerciseId AND w.date < :currentDate")
    Optional<Double> findMaxWeightForUserAndExerciseBeforeDate(
            @Param("userId") Long userId,
            @Param("exerciseId") Long exerciseId,
            @Param("currentDate") LocalDate currentDate);

    @Query("SELECT DISTINCT w.date FROM WorkoutLog w WHERE w.user.id = :userId ORDER BY w.date DESC")
    List<LocalDate> findDistinctDatesByUserId(@Param("userId") Long userId);
}
