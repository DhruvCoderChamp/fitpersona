package com.fitai.workout.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    @Column(nullable = false)
    private Integer dayNumber;

    private String muscleGroupLabel;

    @OneToMany(mappedBy = "workoutDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkoutExercise> exercises = new ArrayList<>();

    @Builder.Default
    private Boolean completed = false;
}
