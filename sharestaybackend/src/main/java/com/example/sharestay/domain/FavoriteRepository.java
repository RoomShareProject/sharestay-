package com.example.sharestay.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndRoom(User user, Room room);

    Favorite findByUser(User user);

    Optional<Favorite> findByUserAndRoom(User user, Room room);

    List<Favorite> findAllByUser(User user);
}
