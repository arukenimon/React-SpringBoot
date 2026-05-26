package com.assessment.baseservice.dto;

import java.util.List;
import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        List<AddressDto> addresses
) {
}
