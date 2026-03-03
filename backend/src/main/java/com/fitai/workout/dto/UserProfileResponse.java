package com.fitai.workout.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private String role;
}
