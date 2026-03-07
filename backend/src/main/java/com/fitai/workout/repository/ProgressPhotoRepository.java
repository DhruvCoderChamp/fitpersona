package com.fitai.workout.repository;

import com.fitai.workout.entity.ProgressPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressPhotoRepository extends JpaRepository<ProgressPhoto, Long> {
    List<ProgressPhoto> findByUserIdOrderByUploadDateDesc(Long userId);
}
