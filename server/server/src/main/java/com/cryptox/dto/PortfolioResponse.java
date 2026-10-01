package com.cryptox.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class PortfolioResponse {

    private BigDecimal totalPortfolioValue;
    private List<PortfolioHoldingResponse> holdings;
}