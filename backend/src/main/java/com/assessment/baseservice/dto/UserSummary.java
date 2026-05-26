package com.assessment.baseservice.dto;

import java.util.UUID;

public record UserSummary(
        UUID id, // Unique identifier for the user 
        String email, // The user's email address
        String firstName, // The user's first name
        String lastName, // The user's last name
        int addressCount // The number of addresses associated with the user
) {
}
