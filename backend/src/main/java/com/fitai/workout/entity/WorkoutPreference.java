package com.fitai.workout.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "workout_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "gender")
    private String gender; // MALE or FEMALE

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FitnessLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Goal goal;

    @Column(nullable = false)
    private Integer daysPerWeek;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Exercise.Equipment equipment;

    @ElementCollection(targetClass = Exercise.MuscleGroup.class)
    @CollectionTable(name = "preference_muscle_groups", joinColumns = @JoinColumn(name = "preference_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "muscle_group")
    private List<Exercise.MuscleGroup> targetMuscleGroups;

    public enum FitnessLevel {
        BEGINNER, INTERMEDIATE, PROFESSIONAL
    }

    public enum Goal {
        // Universal goals (also used for men)
        MUSCLE_GAIN, FAT_LOSS, STRENGTH, ENDURANCE,
        // Women-specific goals
        TONING, FLEXIBILITY, POSTURE, PRENATAL_SAFE
    }
}
