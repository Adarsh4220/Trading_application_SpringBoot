package com.cryptox.service;

import com.cryptox.dto.PortfolioResponse;
import com.cryptox.entity.CryptoHolding;
import com.cryptox.entity.User;
import com.cryptox.repository.CryptoHoldingRepository;
import com.cryptox.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    private final UserRepository userRepository;
    private final CryptoHoldingRepository cryptoHoldingRepository;

    public PortfolioService(
            UserRepository userRepository,
            CryptoHoldingRepository cryptoHoldingRepository) {

        this.userRepository = userRepository;
        this.cryptoHoldingRepository = cryptoHoldingRepository;
    }

    public List<PortfolioResponse> getPortfolio(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<CryptoHolding> holdings =
                cryptoHoldingRepository.findByUser(user);

        return holdings.stream()
                .map(holding ->
                        new PortfolioResponse(
                                holding.getCoinId(),
                                holding.getQuantity()
                        )
                )
                .toList();
    }
}