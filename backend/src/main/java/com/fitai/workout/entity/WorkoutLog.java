package com.fitai.workout.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "workout_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private LocalDate date;

    // For which workout plan/day this log belongs to (optional, can be null if
    // ad-hoc)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id")
    private WorkoutDay workoutDay;

    @Column(nullable = false)
    private Integer setNumber;

    @Column(nullable = false)
    private Integer reps;

    @Column(nullable = false)
    private Double weightLifted;

    private Boolean isPersonalRecord;
}
