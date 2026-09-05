
        package com.cryptox.controller;

import com.cryptox.dto.WalletResponse;
import com.cryptox.entity.User;
import com.cryptox.entity.Wallet;
import com.cryptox.repository.UserRepository;
import com.cryptox.repository.WalletRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public WalletController(
            UserRepository userRepository,
            WalletRepository walletRepository) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        WalletResponse response =
                new WalletResponse(
                        wallet.getId(),
                        wallet.getBalance()
                );

        return ResponseEntity.ok(response);
    }
}


