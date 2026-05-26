package com.assessment.baseservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank @Size(max = 40) String label,
        @NotBlank @Size(max = 120) String line1,
        @Size(max = 120) String line2,
        @NotBlank @Size(max = 80) String city,
        @Size(max = 80) String state,
        @NotBlank @Size(max = 20) String postalCode,
        @NotBlank @Size(max = 80) String country
) {
}
