package com.cryptox.repository;

import com.cryptox.entity.CryptoHolding;
import com.cryptox.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CryptoHoldingRepository
        extends JpaRepository<CryptoHolding, Long> {

    Optional<CryptoHolding> findByUserAndCoinId(
            User user,
            String coinId
    );

    List<CryptoHolding> findByUser(User user);
}
