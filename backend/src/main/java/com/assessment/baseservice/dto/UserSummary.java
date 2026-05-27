package com.assessment.baseservice.dto;

import java.util.UUID;

// This is used for listing users with a summary of their information, including the count of addresses, without exposing the full details of each address
// Like the table view of users, where we want to show basic info and how many addresses they have, but not the full address details
public record UserSummary(
        UUID id, // Unique identifier for the user 
        String email, // The user's email address
        String firstName, // The user's first name
        String lastName, // The user's last name
        int addressCount // The number of addresses associated with the user
) {
}
