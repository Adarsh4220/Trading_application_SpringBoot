package com.cryptox.controller;
import com.cryptox.dto.CoinDetailsResponse;
import com.cryptox.dto.CoinSearchResponse;
import com.cryptox.dto.PricePointResponse;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import com.cryptox.dto.CryptoMarketResponse;
import com.cryptox.service.CryptoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/crypto")
public class CryptoController {

    private final CryptoService cryptoService;

    public CryptoController(CryptoService cryptoService) {
        this.cryptoService = cryptoService;
    }

    @GetMapping("/markets")
    public List<CryptoMarketResponse> getMarkets(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int size) {

        return cryptoService.getMarkets(page, size);
    }

    @GetMapping("/search")
    public List<CoinSearchResponse> searchCoins(
            @RequestParam String query) {

        return cryptoService.searchCoins(query);
    }
    @GetMapping("/{coinId}")
    public CoinDetailsResponse getCoinDetails(
            @PathVariable String coinId) {

        return cryptoService.getCoinDetails(coinId);
    }
    @GetMapping("/{coinId}/chart")
    public List<PricePointResponse> getPriceChart(
            @PathVariable String coinId,
            @RequestParam(defaultValue = "1") int days) {

        return cryptoService.getPriceChart(
                coinId,
                days
        );
    }

}