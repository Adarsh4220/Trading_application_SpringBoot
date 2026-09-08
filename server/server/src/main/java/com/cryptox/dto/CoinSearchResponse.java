package com.cryptox.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoinSearchResponse {

    private String id;
    private String name;
    private String symbol;
    private String thumb;
    private String large;

    @JsonProperty("market_cap_rank")
    private Integer marketCapRank;
}