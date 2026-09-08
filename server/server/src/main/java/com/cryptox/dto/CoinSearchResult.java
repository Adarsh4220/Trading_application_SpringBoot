package com.cryptox.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CoinSearchResult {

    private List<CoinSearchResponse> coins;
}