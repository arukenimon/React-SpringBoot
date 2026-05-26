package com.assessment.baseservice;

import com.assessment.baseservice.dto.AddressDto;
import com.assessment.baseservice.dto.AddressRequest;
import com.assessment.baseservice.dto.UserDto;
import com.assessment.baseservice.dto.UserRequest;
import com.assessment.baseservice.exception.NotFoundException;
import com.assessment.baseservice.service.UserService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    @Test
    void createUpdateAndDeleteUserRoundtrip() {
        UserService svc = new UserService();
        UserDto created = svc.createUser(new UserRequest("a@b.com", "A", "B"));
        assertEquals("a@b.com", created.email());

        UserDto updated = svc.updateUser(created.id(), new UserRequest("c@d.com", "C", "D"));
        assertEquals("c@d.com", updated.email());
        assertEquals("D", updated.lastName());

        svc.deleteUser(created.id());
        assertThrows(NotFoundException.class, () -> svc.getUser(created.id()));
    }

    @Test
    void addressLifecycleScopedToUser() {
        UserService svc = new UserService();
        UserDto user = svc.createUser(new UserRequest("a@b.com", "A", "B"));

        AddressDto addr = svc.addAddress(user.id(),
                new AddressRequest("Home", "1 Main St", null, "Townsville", "TS", "00000", "USA"));
        assertEquals(1, svc.listAddresses(user.id()).size());

        AddressDto updated = svc.updateAddress(user.id(), addr.id(),
                new AddressRequest("Work", "2 Office Rd", "Suite 1", "Cityville", "CV", "11111", "USA"));
        assertEquals("Work", updated.label());

        svc.deleteAddress(user.id(), addr.id());
        assertEquals(0, svc.listAddresses(user.id()).size());
    }
}
