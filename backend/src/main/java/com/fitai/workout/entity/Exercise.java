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

    @Column(name = "gif_url", length = 500)
    private String gifUrl;

    private Integer defaultSets;
    private Integer defaultReps;
    private Integer defaultRestSeconds;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String commonMistakes;

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
