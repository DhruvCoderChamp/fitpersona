package com.fitai.workout.repository;

import com.fitai.workout.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUserIdOrderBySubmittedAtDesc(Long userId);
}
