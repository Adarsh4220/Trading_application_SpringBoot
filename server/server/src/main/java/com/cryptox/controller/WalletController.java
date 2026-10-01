package com.cryptox.controller;

import com.cryptox.dto.DepositRequest;
import com.cryptox.dto.TransactionResponse;
import com.cryptox.dto.WalletResponse;
import com.cryptox.dto.WithdrawRequest;
import com.cryptox.entity.Transaction;
import com.cryptox.entity.TransactionType;
import com.cryptox.entity.User;
import com.cryptox.entity.Wallet;
import com.cryptox.repository.TransactionRepository;
import com.cryptox.repository.UserRepository;
import com.cryptox.repository.WalletRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public WalletController(
            UserRepository userRepository,
            WalletRepository walletRepository,
            TransactionRepository transactionRepository) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    // =========================
    // GET WALLET
    // =========================

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

    // =========================
    // DEPOSIT
    // =========================

    @PostMapping("/deposit")
    public ResponseEntity<WalletResponse> deposit(
            @RequestBody DepositRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        if (request.getAmount() == null ||
                request.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }

        wallet.setBalance(
                wallet.getBalance()
                        .add(request.getAmount())
        );

        walletRepository.save(wallet);

        Transaction transaction =
                Transaction.builder()
                        .user(user)
                        .type(TransactionType.DEPOSIT)
                        .amount(request.getAmount())
                        .createdAt(LocalDateTime.now())
                        .build();

        transactionRepository.save(transaction);

        WalletResponse response =
                new WalletResponse(
                        wallet.getId(),
                        wallet.getBalance()
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // TRANSACTION HISTORY
    // =========================

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Transaction> transactions =
                transactionRepository
                        .findByUserOrderByCreatedAtDesc(user);

        List<TransactionResponse> response =
                transactions.stream()
                        .map(transaction -> {

                            BigDecimal cryptoPrice = null;

                            if (transaction.getCryptoQuantity() != null &&
                                    transaction.getCryptoQuantity()
                                            .compareTo(BigDecimal.ZERO) > 0) {

                                cryptoPrice =
                                        transaction.getAmount()
                                                .divide(
                                                        transaction.getCryptoQuantity(),
                                                        18,
                                                        RoundingMode.HALF_UP
                                                );
                            }

                            return new TransactionResponse(
                                    transaction.getId(),
                                    transaction.getType(),
                                    transaction.getAmount(),
                                    transaction.getCoinId(),
                                    transaction.getCryptoQuantity(),
                                    transaction.getCryptoPrice(),
                                    transaction.getCreatedAt()
                            );
                        })
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =========================
    // WITHDRAW
    // =========================

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(
            @RequestBody WithdrawRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        if (request.getAmount() == null ||
                request.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Amount must be greater than zero");
        }

        if (wallet.getBalance()
                .compareTo(request.getAmount()) < 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Insufficient wallet balance");
        }

        wallet.setBalance(
                wallet.getBalance()
                        .subtract(request.getAmount())
        );

        walletRepository.save(wallet);

        Transaction transaction =
                Transaction.builder()
                        .user(user)
                        .type(TransactionType.WITHDRAWAL)
                        .amount(request.getAmount())
                        .createdAt(LocalDateTime.now())
                        .build();

        transactionRepository.save(transaction);

        WalletResponse response =
                new WalletResponse(
                        wallet.getId(),
                        wallet.getBalance()
                );

        return ResponseEntity.ok(response);
    }
}

