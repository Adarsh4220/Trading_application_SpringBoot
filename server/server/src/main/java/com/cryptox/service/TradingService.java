package com.cryptox.service;
import org.springframework.transaction.annotation.Transactional;
import com.cryptox.dto.BuyCryptoRequest;
import com.cryptox.dto.BuyCryptoResponse;
import com.cryptox.entity.*;
import com.cryptox.repository.CryptoHoldingRepository;
import com.cryptox.repository.TransactionRepository;
import com.cryptox.repository.UserRepository;
import com.cryptox.repository.WalletRepository;
import org.springframework.stereotype.Service;
import com.cryptox.dto.SellCryptoRequest;
import com.cryptox.dto.SellCryptoResponse;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TradingService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final CryptoHoldingRepository cryptoHoldingRepository;
    private final TransactionRepository transactionRepository;
    private final CryptoService cryptoService;

    public TradingService(
            UserRepository userRepository,
            WalletRepository walletRepository,
            CryptoHoldingRepository cryptoHoldingRepository,
            TransactionRepository transactionRepository,
            CryptoService cryptoService) {

        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.cryptoHoldingRepository = cryptoHoldingRepository;
        this.transactionRepository = transactionRepository;
        this.cryptoService = cryptoService;
    }
    @Transactional
    public BuyCryptoResponse buyCrypto(
            String email,
            BuyCryptoRequest request) {

        // 1. Validate request
        if (request.getCoinId() == null ||
                request.getCoinId().isBlank()) {

            throw new RuntimeException("Coin ID is required");
        }

        if (request.getAmount() == null ||
                request.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }

        // 2. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 3. Find wallet
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        // 4. Check wallet balance
        if (wallet.getBalance()
                .compareTo(request.getAmount()) < 0) {

            throw new RuntimeException(
                    "Insufficient wallet balance"
            );
        }

        // 5. Get current crypto price
        BigDecimal cryptoPrice =
                cryptoService.getCurrentPrice(
                        request.getCoinId()
                );

        // 6. Calculate crypto quantity
        BigDecimal cryptoQuantity =
                request.getAmount()
                        .divide(
                                cryptoPrice,
                                18,
                                java.math.RoundingMode.DOWN
                        );

        // 7. Deduct money from wallet
        wallet.setBalance(
                wallet.getBalance()
                        .subtract(request.getAmount())
        );

        walletRepository.save(wallet);

        // 8. Find existing crypto holding
        CryptoHolding holding =
                cryptoHoldingRepository
                        .findByUserAndCoinId(
                                user,
                                request.getCoinId()
                        )
                        .orElse(null);

        // 9. Create holding if it doesn't exist
        if (holding == null) {

            holding = CryptoHolding.builder()
                    .user(user)
                    .coinId(request.getCoinId())
                    .quantity(cryptoQuantity)
                    .build();

        } else {

            // Add crypto to existing holding
            holding.setQuantity(
                    holding.getQuantity()
                            .add(cryptoQuantity)
            );
        }

        cryptoHoldingRepository.save(holding);

        // 10. Create transaction
        Transaction transaction =
                Transaction.builder()
                        .user(user)
                        .type(TransactionType.BUY)
                        .amount(request.getAmount())
                        .coinId(request.getCoinId())
                        .cryptoQuantity(cryptoQuantity)
                        .cryptoPrice(cryptoPrice)
                        .createdAt(LocalDateTime.now())
                        .build();

        transactionRepository.save(transaction);

        // 11. Return response
        return new BuyCryptoResponse(
                request.getCoinId(),
                request.getAmount(),
                cryptoQuantity,
                cryptoPrice,
                wallet.getBalance()
        );
    }
    @Transactional
    public SellCryptoResponse sellCrypto(
            String email,
            SellCryptoRequest request) {

        // 1. Validate coin ID
        if (request.getCoinId() == null ||
                request.getCoinId().isBlank()) {

            throw new RuntimeException("Coin ID is required");
        }

        // 2. Validate quantity
        if (request.getQuantity() == null ||
                request.getQuantity()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        // 3. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 4. Find wallet
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        // 5. Find crypto holding
        CryptoHolding holding =
                cryptoHoldingRepository
                        .findByUserAndCoinId(
                                user,
                                request.getCoinId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Crypto holding not found"
                                ));

        // 6. Check crypto quantity
        if (holding.getQuantity()
                .compareTo(request.getQuantity()) < 0) {

            throw new RuntimeException(
                    "Insufficient crypto balance"
            );
        }

        // 7. Get current crypto price
        BigDecimal cryptoPrice =
                cryptoService.getCurrentPrice(
                        request.getCoinId()
                );

        // 8. Calculate USD amount
        BigDecimal amountReceived =
                request.getQuantity()
                        .multiply(cryptoPrice);

        // 9. Reduce crypto holding
        holding.setQuantity(
                holding.getQuantity()
                        .subtract(request.getQuantity())
        );

        cryptoHoldingRepository.save(holding);

        // 10. Add money to wallet
        wallet.setBalance(
                wallet.getBalance()
                        .add(amountReceived)
        );

        walletRepository.save(wallet);

        // 11. Create SELL transaction
        Transaction transaction =
                Transaction.builder()
                        .user(user)
                        .type(TransactionType.SELL)
                        .amount(amountReceived)
                        .coinId(request.getCoinId())
                        .cryptoQuantity(request.getQuantity())
                        .cryptoPrice(cryptoPrice)
                        .createdAt(LocalDateTime.now())
                        .build();

        transactionRepository.save(transaction);

        // 12. Return response
        return new SellCryptoResponse(
                request.getCoinId(),
                request.getQuantity(),
                cryptoPrice,
                amountReceived,
                holding.getQuantity(),
                wallet.getBalance()
        );
    }
}