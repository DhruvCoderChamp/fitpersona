package com.fitai.workout.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String category; // e.g. "General", "Bug Report", "Feature Request", "Workout Plan"

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(nullable = false)
    private Integer rating; // 1-5 stars

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
