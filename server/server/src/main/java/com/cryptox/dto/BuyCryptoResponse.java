package com.cryptox.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class BuyCryptoResponse {

    private String coinId;
    private BigDecimal amountSpent;
    private BigDecimal cryptoQuantity;
    private BigDecimal cryptoPrice;
    private BigDecimal remainingBalance;
}