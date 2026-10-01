package com.cryptox.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PortfolioResponse {

    private String coinId;
    private BigDecimal quantity;
}