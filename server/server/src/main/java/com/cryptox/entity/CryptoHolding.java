package com.cryptox.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "crypto_holdings",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "coin_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CryptoHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "coin_id", nullable = false)
    private String coinId;

    @Column(nullable = false, precision = 30, scale = 18)
    private BigDecimal quantity;
}
