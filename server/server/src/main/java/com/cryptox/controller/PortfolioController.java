package com.cryptox.controller;

import com.cryptox.dto.PortfolioResponse;
import com.cryptox.service.PortfolioService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public List<PortfolioResponse> getPortfolio(
            Authentication authentication) {

        String email = authentication.getName();

        return portfolioService.getPortfolio(email);
    }
}