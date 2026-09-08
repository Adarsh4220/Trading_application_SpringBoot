package com.cryptox.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CoinDetailsResponse {

    private String id;
    private String symbol;
    private String name;
//    private String description;

    @JsonProperty("market_cap_rank")
    private Integer marketCapRank;

    private Image image;

    private MarketData market_data;

    @Getter
    @Setter
    public static class Image {
        private String thumb;
        private String small;
        private String large;
    }

    @Getter
    @Setter
    public static class MarketData {

        @JsonProperty("current_price")
        private CurrentPrice currentPrice;

        @JsonProperty("market_cap")
        private MarketCap marketCap;

        @JsonProperty("price_change_percentage_24h")
        private BigDecimal priceChangePercentage24h;

        @JsonProperty("high_24h")
        private High24h high24h;

        @JsonProperty("low_24h")
        private Low24h low24h;
    }

    @Getter
    @Setter
    public static class CurrentPrice {

        private BigDecimal usd;
    }

    @Getter
    @Setter
    public static class MarketCap {

        private BigDecimal usd;
    }

    @Getter
    @Setter
    public static class High24h {

        private BigDecimal usd;
    }

    @Getter
    @Setter
    public static class Low24h {

        private BigDecimal usd;
    }
}