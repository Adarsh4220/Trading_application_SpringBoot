package com.cryptox.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PricePointResponse {

    private LocalDateTime time;
    private BigDecimal price;
}