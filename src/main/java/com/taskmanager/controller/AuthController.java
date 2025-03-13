package com.taskmanager.controller;

import com.taskmanager.model.User;
import com.taskmanager.service.UserService;
import com.taskmanager.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        userService.registerUser(user.getUsername(), user.getPassword());

//        String token = userService.authenticateUser(user.getUsername(), user.getPassword());

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        String token = userService.authenticateUser(user.getUsername(), user.getPassword());

        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}