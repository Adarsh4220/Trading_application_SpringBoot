package com.cryptox.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "CryptoX - Your OTP"
        );

        message.setText(
                "Hello,\n\n" +
                        "Your CryptoX verification OTP is:\n\n" +
                        otp +
                        "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this OTP, " +
                        "please ignore this email.\n\n" +
                        "Regards,\n" +
                        "CryptoX Team"
        );

        mailSender.send(message);
    }
}