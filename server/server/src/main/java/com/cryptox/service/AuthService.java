package com.cryptox.service;

import com.cryptox.dto.LoginRequest;
import com.cryptox.dto.RegisterRequest;
import com.cryptox.entity.User;
import com.cryptox.entity.Wallet;
import com.cryptox.repository.UserRepository;
import com.cryptox.repository.WalletRepository;
import com.cryptox.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            WalletRepository walletRepository,
            OtpService otpService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.walletRepository = walletRepository;
        this.otpService = otpService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .twoFactorEnabled(false)
                .build();

        userRepository.save(user);

        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .build();

        walletRepository.save(wallet);

        return "Registration successful";
    }

    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "Invalid email or password";
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            return "Invalid email or password";
        }

        /*
         * Check whether 2FA is enabled
         */
        if (user.isTwoFactorEnabled()) {

            // Generate and send OTP
            otpService.generateOtp(user);

            return "2FA_REQUIRED";
        }

        /*
         * Normal login when 2FA is disabled
         */
        return jwtService.generateToken(
                user.getEmail()
        );
    }
    public String enableTwoFactor(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setTwoFactorEnabled(true);

        userRepository.save(user);

        return "Two-factor authentication enabled";
    }
    public String sendForgotPasswordOtp(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        otpService.generateOtp(user);

        return "Password reset OTP sent successfully";
    }
    public String resetPassword(
            String email,
            String otp,
            String newPassword) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        boolean verified =
                otpService.verifyOtp(
                        user,
                        otp
                );

        if (!verified) {
            return "Invalid or expired OTP";
        }

        if (newPassword == null ||
                newPassword.length() < 8) {

            return "Password must be at least 8 characters";
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        return "Password reset successfully";
    }

    public String verifyLoginOtp(
            String email,
            String otp) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        boolean verified =
                otpService.verifyOtp(
                        user,
                        otp
                );

        if (!verified) {
            return "Invalid or expired OTP";
        }

        /*
         * OTP is correct.
         * Now generate the JWT.
         */
        return jwtService.generateToken(
                user.getEmail()
        );
    }
}



