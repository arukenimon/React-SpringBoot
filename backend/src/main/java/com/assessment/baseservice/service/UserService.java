package com.assessment.baseservice.service;

import com.assessment.baseservice.dto.AddressDto;
import com.assessment.baseservice.dto.AddressRequest;
import com.assessment.baseservice.dto.UserDto;
import com.assessment.baseservice.dto.UserRequest;
import com.assessment.baseservice.dto.UserSummary;
import com.assessment.baseservice.exception.NotFoundException;
import com.assessment.baseservice.model.Address;
import com.assessment.baseservice.model.User;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final ConcurrentHashMap<UUID, User> users = new ConcurrentHashMap<>();

    // ---------- Users ----------

    public List<UserSummary> listUsers() {
        return users.values().stream()
                .sorted(Comparator.comparing(User::getLastName, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(User::getFirstName, String.CASE_INSENSITIVE_ORDER))
                .map(u -> new UserSummary(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(),
                        u.getAddresses().size()))
                .toList();
    }

    public UserDto getUser(UUID id) {
        return toDto(requireUser(id));
    }

    public UserDto createUser(UserRequest request) {
        User user = new User(UUID.randomUUID(), request.email(), request.firstName(), request.lastName());
        users.put(user.getId(), user);
        return toDto(user);
    }

    public UserDto updateUser(UUID id, UserRequest request) {
        User user = requireUser(id);
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        return toDto(user);
    }

    public void deleteUser(UUID id) {
        if (users.remove(id) == null) {
            throw new NotFoundException("User " + id + " not found");
        }
    }

    // ---------- Addresses ----------

    public List<AddressDto> listAddresses(UUID userId) {
        return requireUser(userId).getAddresses().stream()
                .map(UserService::toDto)
                .toList();
    }

    public AddressDto addAddress(UUID userId, AddressRequest request) {
        User user = requireUser(userId);
        Address address = new Address(
                UUID.randomUUID(),
                request.label(),
                request.line1(),
                request.line2(),
                request.city(),
                request.state(),
                request.postalCode(),
                request.country()
        );
        user.getAddresses().add(address);
        return toDto(address);
    }

    public AddressDto updateAddress(UUID userId, UUID addressId, AddressRequest request) {
        Address address = requireAddress(userId, addressId);
        address.setLabel(request.label());
        address.setLine1(request.line1());
        address.setLine2(request.line2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPostalCode(request.postalCode());
        address.setCountry(request.country());
        return toDto(address);
    }

    public void deleteAddress(UUID userId, UUID addressId) {
        User user = requireUser(userId);
        boolean removed = user.getAddresses().removeIf(a -> a.getId().equals(addressId));
        if (!removed) {
            throw new NotFoundException("Address " + addressId + " not found for user " + userId);
        }
    }

    // ---------- Seeding helper (used by DataSeeder) ----------

    public void seedUser(User user) {
        users.put(user.getId(), user);
    }

    // ---------- Internals ----------

    private User requireUser(UUID id) {
        User user = users.get(id);
        if (user == null) {
            throw new NotFoundException("User " + id + " not found");
        }
        return user;
    }

    private Address requireAddress(UUID userId, UUID addressId) {
        return requireUser(userId).getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(
                        "Address " + addressId + " not found for user " + userId));
    }

    static UserDto toDto(User user) {
        List<AddressDto> addresses = user.getAddresses().stream()
                .map(UserService::toDto)
                .toList();
        return new UserDto(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), addresses);
    }

    static AddressDto toDto(Address a) {
        return new AddressDto(a.getId(), a.getLabel(), a.getLine1(), a.getLine2(),
                a.getCity(), a.getState(), a.getPostalCode(), a.getCountry());
    }
}
