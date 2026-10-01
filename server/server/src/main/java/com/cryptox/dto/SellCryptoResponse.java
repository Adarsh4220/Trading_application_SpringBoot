package com.cryptox.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class SellCryptoResponse {

    private String coinId;
    private BigDecimal quantitySold;
    private BigDecimal cryptoPrice;
    private BigDecimal amountReceived;
    private BigDecimal remainingQuantity;
    private BigDecimal walletBalance;
}