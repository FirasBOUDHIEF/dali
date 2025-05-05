package com.freelanceproject.authorization_authentication.controllers;

import com.freelanceproject.authorization_authentication.model.Role;
import com.freelanceproject.authorization_authentication.model.UserEntity;
import com.freelanceproject.authorization_authentication.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin("*")

public class managementUser {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    @GetMapping("/allfreelancer")
    public ResponseEntity<List<UserEntity>> getallfreelancer() {
        return ResponseEntity.ok(userService.findbyrole(Role.ROLE_FREELANCER));
    }
    @GetMapping("/alladmins")
    public ResponseEntity<List<UserEntity>> alladmins() {
        return ResponseEntity.ok(userService.findbyrole(Role.ROLE_ADMIN));
    }
    @GetMapping("/allclients")
    public ResponseEntity<List<UserEntity>> allclients() {
        return ResponseEntity.ok(userService.findbyrole(Role.ROLE_CLIENT));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> createUser(@PathVariable Long id, @RequestBody UserEntity updatedUser) {
        return ResponseEntity.ok(userService.createUser(id, updatedUser));
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<UserEntity> updateUser(@PathVariable Long id, @RequestBody UserEntity userDTO) {
//        return ResponseEntity.ok(userService.updateUser(id, userDTO));
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
