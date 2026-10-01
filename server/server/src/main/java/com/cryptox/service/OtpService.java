package com.cryptox.service;

import com.cryptox.entity.User;
import com.cryptox.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public OtpService(
            UserRepository userRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public String generateOtp(User user) {

        // Generate 6 digit OTP
        int otpNumber =
                100000 + secureRandom.nextInt(900000);

        String otp =
                String.valueOf(otpNumber);

        // OTP expires after 5 minutes
        LocalDateTime expiry =
                LocalDateTime.now()
                        .plusMinutes(5);

        user.setOtp(otp);
        user.setOtpExpiry(expiry);

        userRepository.save(user);

        // Send OTP to user's email
        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

        return otp;
    }

    public boolean verifyOtp(
            User user,
            String otp) {

        if (user.getOtp() == null ||
                user.getOtpExpiry() == null) {

            return false;
        }

        // Check expiry
        if (LocalDateTime.now()
                .isAfter(user.getOtpExpiry())) {

            return false;
        }

        // Check OTP
        if (!user.getOtp().equals(otp)) {

            return false;
        }

        // OTP successfully used
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return true;
    }
}