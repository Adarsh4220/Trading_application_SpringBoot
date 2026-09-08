package com.cryptox.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MarketChartResponse {

    private List<List<Double>> prices;
}