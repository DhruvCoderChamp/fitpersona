package com.fitai.workout.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {

    @NotBlank
    private String category;

    @NotBlank
    @Size(min = 5, max = 2000)
    private String message;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
}
