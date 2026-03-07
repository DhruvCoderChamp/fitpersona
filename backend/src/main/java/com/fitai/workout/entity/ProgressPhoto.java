package com.fitai.workout.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String photoUrl;

    private String notes;

    @Builder.Default
    private LocalDateTime uploadDate = LocalDateTime.now();
}
