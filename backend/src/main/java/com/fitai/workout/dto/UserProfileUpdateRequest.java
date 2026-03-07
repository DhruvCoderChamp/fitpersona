package com.fitai.workout.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String name;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
}
