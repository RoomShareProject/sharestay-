package com.example.sharestay.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FavoriteDto {
    private String roomName;
    private LocalDateTime likedAt;

    public FavoriteDto(String roomName, LocalDateTime likedAt) {
        this.roomName = roomName;
        this.likedAt = likedAt;
    }
}
