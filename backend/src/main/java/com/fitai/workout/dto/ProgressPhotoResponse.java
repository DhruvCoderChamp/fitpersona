package com.fitai.workout.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressPhotoResponse {
    private Long id;
    private String photoUrl;
    private String notes;
    private LocalDateTime uploadDate;
}
