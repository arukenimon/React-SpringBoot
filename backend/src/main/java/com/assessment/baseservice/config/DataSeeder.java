package com.assessment.baseservice.config;

import com.assessment.baseservice.model.Address;
import com.assessment.baseservice.model.User;
import com.assessment.baseservice.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DataSeeder {

    private final UserService userService;

    public DataSeeder(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    public void seed() {
        User ada = new User(UUID.randomUUID(), "ada.lovelace@example.com", "Ada", "Lovelace");
        ada.getAddresses().add(new Address(UUID.randomUUID(), "Home",
                "12 Analytical Engine St", null, "London", "", "SW1A 1AA", "United Kingdom"));
        ada.getAddresses().add(new Address(UUID.randomUUID(), "Work",
                "1 Babbage Lane", "Suite 4", "London", "", "EC1A 1BB", "United Kingdom"));
        userService.seedUser(ada);

        User grace = new User(UUID.randomUUID(), "grace.hopper@example.com", "Grace", "Hopper");
        grace.getAddresses().add(new Address(UUID.randomUUID(), "Home",
                "200 COBOL Ave", null, "Arlington", "VA", "22201", "USA"));
        userService.seedUser(grace);

        User alan = new User(UUID.randomUUID(), "alan.turing@example.com", "Alan", "Turing");
        alan.getAddresses().add(new Address(UUID.randomUUID(), "Home",
                "78 Bombe Rd", null, "Bletchley", "", "MK3 6EB", "United Kingdom"));
        alan.getAddresses().add(new Address(UUID.randomUUID(), "Office",
                "King's College", "Trinity Lane", "Cambridge", "", "CB2 1ST", "United Kingdom"));
        alan.getAddresses().add(new Address(UUID.randomUUID(), "Holiday",
                "Coastal Cottage", null, "Brighton", "", "BN1 1AA", "United Kingdom"));
        userService.seedUser(alan);

        User linus = new User(UUID.randomUUID(), "linus.torvalds@example.com", "Linus", "Torvalds");
        linus.getAddresses().add(new Address(UUID.randomUUID(), "Home",
                "42 Kernel Way", null, "Portland", "OR", "97201", "USA"));
        userService.seedUser(linus);

        User margaret = new User(UUID.randomUUID(), "margaret.hamilton@example.com", "Margaret", "Hamilton");
        margaret.getAddresses().add(new Address(UUID.randomUUID(), "Home",
                "1969 Apollo Dr", null, "Boston", "MA", "02108", "USA"));
        margaret.getAddresses().add(new Address(UUID.randomUUID(), "Work",
                "MIT Instrumentation Lab", "Building 42", "Cambridge", "MA", "02139", "USA"));
        userService.seedUser(margaret);
    }
}
