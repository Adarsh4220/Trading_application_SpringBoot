
        package com.cryptox.controller;

import com.cryptox.dto.LoginRequest;
import com.cryptox.dto.RegisterRequest;
import com.cryptox.entity.User;
import com.cryptox.repository.UserRepository;
import com.cryptox.service.AuthService;
import com.cryptox.service.OtpService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final OtpService otpService;

    public AuthController(
            AuthService authService,
            UserRepository userRepository,
            OtpService otpService) {

        this.authService = authService;
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(
            @RequestParam String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        otpService.generateOtp(user);

        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }
}
