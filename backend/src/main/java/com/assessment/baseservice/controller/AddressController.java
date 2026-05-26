package com.assessment.baseservice.controller;

import com.assessment.baseservice.dto.AddressDto;
import com.assessment.baseservice.dto.AddressRequest;
import com.assessment.baseservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/{userId}/addresses")
public class AddressController {

    private final UserService userService;

    public AddressController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<AddressDto> list(@PathVariable UUID userId) {
        return userService.listAddresses(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AddressDto create(@PathVariable UUID userId, @Valid @RequestBody AddressRequest request) {
        return userService.addAddress(userId, request);
    }

    @PutMapping("/{addressId}")
    public AddressDto update(@PathVariable UUID userId,
                             @PathVariable UUID addressId,
                             @Valid @RequestBody AddressRequest request) {
        return userService.updateAddress(userId, addressId, request);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> delete(@PathVariable UUID userId, @PathVariable UUID addressId) {
        userService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}
