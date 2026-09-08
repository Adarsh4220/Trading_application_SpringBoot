package com.cryptox.service;

import com.cryptox.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Arrays;
import java.util.List;

@Service
public class CryptoService {

    private final RestClient restClient;

    public CryptoService(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<CryptoMarketResponse> getMarkets(
            int page,
            int size) {

        CryptoMarketResponse[] coins =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/coins/markets")
                                .queryParam("vs_currency", "usd")
                                .queryParam("order", "market_cap_desc")
                                .queryParam("per_page", size)
                                .queryParam("page", page)
                                .build())
                        .retrieve()
                        .body(CryptoMarketResponse[].class);

        return Arrays.asList(coins);
    }
    public List<CoinSearchResponse> searchCoins(String query) {

        CoinSearchResult result =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/search")
                                .queryParam("query", query)
                                .build())
                        .retrieve()
                        .body(CoinSearchResult.class);

        return result.getCoins();
    }
    public CoinDetailsResponse getCoinDetails(String coinId) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/coins/{id}")
                        .build(coinId))
                .retrieve()
                .body(CoinDetailsResponse.class);
    }
    public List<PricePointResponse> getPriceChart(
            String coinId,
            int days) {

        MarketChartResponse result =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/coins/{id}/market_chart")
                                .queryParam("vs_currency", "usd")
                                .queryParam("days", days)
                                .build(coinId))
                        .retrieve()
                        .body(MarketChartResponse.class);

        return result.getPrices()
                .stream()
                .map(price -> {

                    long timestamp =
                            price.get(0).longValue();

                    BigDecimal value =
                            BigDecimal.valueOf(price.get(1));

                    LocalDateTime time =
                            LocalDateTime.ofInstant(
                                    Instant.ofEpochMilli(timestamp),
                                    ZoneId.systemDefault()
                            );

                    return new PricePointResponse(
                            time,
                            value
                    );
                })
                .toList();
    }
}