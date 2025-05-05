package com.freelanceproject.authorization_authentication.controllers;

import com.freelanceproject.authorization_authentication.model.LoginRequestDTO;
import com.freelanceproject.authorization_authentication.model.UserEntity;
import com.freelanceproject.authorization_authentication.service.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController
{
    @Autowired
    private ServiceImpl service;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserEntity user){
        return ResponseEntity.ok(service.registerUser(user));
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO user){
        return ResponseEntity.ok(service.login(user.username(), user.password()));
    }
}
