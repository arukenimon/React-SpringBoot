package com.assessment.baseservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(
        @NotBlank @Email @Size(max = 254) String email, // This field is required, must be a valid email format, and has a maximum length of 254 characters
        @NotBlank @Size(max = 80) String firstName, // This field is required and has a maximum length of 80 characters
        @NotBlank @Size(max = 80) String lastName // This field is required and has a maximum length of 80 characters
) {
}
