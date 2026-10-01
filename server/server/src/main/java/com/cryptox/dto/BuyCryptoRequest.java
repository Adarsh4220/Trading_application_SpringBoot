package com.cryptox.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BuyCryptoRequest {

    private String coinId;

    private BigDecimal amount;
}