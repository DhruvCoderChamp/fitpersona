package com.fitai.workout.repository;

import com.fitai.workout.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
        List<Exercise> findByMuscleGroup(Exercise.MuscleGroup muscleGroup);

        List<Exercise> findByMuscleGroupAndEquipment(Exercise.MuscleGroup muscleGroup, Exercise.Equipment equipment);

        List<Exercise> findByMuscleGroupAndEquipmentAndDifficultyIn(
                        Exercise.MuscleGroup muscleGroup,
                        Exercise.Equipment equipment,
                        List<Exercise.Difficulty> difficulties);

        List<Exercise> findByMuscleGroupAndDifficultyIn(
                        Exercise.MuscleGroup muscleGroup,
                        List<Exercise.Difficulty> difficulties);

        java.util.Optional<Exercise> findByName(String name);
}
