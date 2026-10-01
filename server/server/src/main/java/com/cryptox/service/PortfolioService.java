package com.cryptox.service;

import com.cryptox.dto.PortfolioHoldingResponse;
import com.cryptox.dto.PortfolioResponse;
import com.cryptox.entity.CryptoHolding;
import com.cryptox.entity.User;
import com.cryptox.repository.CryptoHoldingRepository;
import com.cryptox.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PortfolioService {

    private final UserRepository userRepository;
    private final CryptoHoldingRepository cryptoHoldingRepository;
    private final CryptoService cryptoService;

    public PortfolioService(
            UserRepository userRepository,
            CryptoHoldingRepository cryptoHoldingRepository,
            CryptoService cryptoService) {

        this.userRepository = userRepository;
        this.cryptoHoldingRepository = cryptoHoldingRepository;
        this.cryptoService = cryptoService;
    }

    public PortfolioResponse getPortfolio(String email) {

        // 1. Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Get all crypto holdings of this user
        List<CryptoHolding> holdings =
                cryptoHoldingRepository.findByUser(user);

        // 3. Convert holdings into response objects
        List<PortfolioHoldingResponse> holdingResponses =
                holdings.stream()
                        .map(holding -> {

                            // Get current crypto price from CoinGecko
                            BigDecimal currentPrice =
                                    cryptoService.getCurrentPrice(
                                            holding.getCoinId()
                                    );

                            // quantity × current price
                            BigDecimal currentValue =
                                    holding.getQuantity()
                                            .multiply(currentPrice);

                            return new PortfolioHoldingResponse(
                                    holding.getCoinId(),
                                    holding.getQuantity(),
                                    currentPrice,
                                    currentValue
                            );
                        })
                        .toList();

        // 4. Calculate total portfolio value
        BigDecimal totalPortfolioValue =
                holdingResponses.stream()
                        .map(PortfolioHoldingResponse::getCurrentValue)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // 5. Return complete portfolio
        return new PortfolioResponse(
                totalPortfolioValue,
                holdingResponses
        );
    }
}