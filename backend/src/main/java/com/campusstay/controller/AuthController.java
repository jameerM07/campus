package com.campusstay.controller;

import com.campusstay.dto.*;
import com.campusstay.entity.User;
import com.campusstay.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/student/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.ok("Student registered successfully", response));
    }

    @PostMapping("/owner/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerOwner(@Valid @RequestBody OwnerRegisterRequest request) {
        AuthResponse response = authService.registerOwner(request);
        return ResponseEntity.ok(ApiResponse.ok("Owner registered successfully. Verification is pending approval.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}

