
        package com.cryptox.controller;
        import com.cryptox.dto.ForgotPasswordRequest;
        import com.cryptox.dto.OtpRequest;
import com.cryptox.dto.LoginRequest;
import com.cryptox.dto.RegisterRequest;
import com.cryptox.entity.User;
import com.cryptox.repository.UserRepository;
import com.cryptox.service.AuthService;
import com.cryptox.service.OtpService;
        import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
        import com.cryptox.dto.ForgotPasswordRequest;
        import com.cryptox.dto.ResetPasswordRequest;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8083")
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
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody OtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        boolean verified =
                otpService.verifyOtp(
                        user,
                        request.getOtp()
                );

        if (!verified) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid or expired OTP");
        }

        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<String> verifyLoginOtp(
            @RequestBody OtpRequest request) {

        return ResponseEntity.ok(
                authService.verifyLoginOtp(
                        request.getEmail(),
                        request.getOtp()
                )
        );
    }
    @PostMapping("/2fa/enable")
    public ResponseEntity<String> enableTwoFactor(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                authService.enableTwoFactor(email)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.sendForgotPasswordOtp(
                        request.getEmail()
                )
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(
                        request.getEmail(),
                        request.getOtp(),
                        request.getNewPassword()
                )
        );
    }

}
