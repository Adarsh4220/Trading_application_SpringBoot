package com.cryptox.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PortfolioHoldingResponse {

    private String coinId;
    private BigDecimal quantity;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
}