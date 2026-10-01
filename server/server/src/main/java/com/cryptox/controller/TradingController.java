package com.cryptox.controller;

import com.cryptox.dto.BuyCryptoRequest;
import com.cryptox.dto.BuyCryptoResponse;
import com.cryptox.dto.SellCryptoRequest;
import com.cryptox.dto.SellCryptoResponse;
import com.cryptox.service.TradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trading")
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buyCrypto(
            @RequestBody BuyCryptoRequest request,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            BuyCryptoResponse response =
                    tradingService.buyCrypto(
                            email,
                            request
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @PostMapping("/sell")
    public ResponseEntity<?> sellCrypto(
            @RequestBody SellCryptoRequest request,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            SellCryptoResponse response =
                    tradingService.sellCrypto(
                            email,
                            request
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}