package com.fitai.workout.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MuscleGroup muscleGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Equipment equipment;

    @Column(length = 500)
    private String description;

    private Integer defaultSets;
    private Integer defaultReps;
    private Integer defaultRestSeconds;

    public enum MuscleGroup {
        CHEST, TRICEPS, BICEPS, LEGS, BACK, SHOULDERS, CORE
    }

    public enum Difficulty {
        BEGINNER, INTERMEDIATE, ADVANCED
    }

    public enum Equipment {
        GYM, HOME, NO_EQUIPMENT
    }
}
