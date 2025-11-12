package com.example.sharestay.dto;

import com.example.sharestay.entity.Favorite;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FavoriteDto {
    private Long roomId;       // DB 참조용
    private String roomName;   // 프론트 표시용
    private String roomImg;    // 프론트 표시용
    private LocalDateTime likedAt;

    public FavoriteDto(Favorite favorite) {
        this.roomId = favorite.getRoom().getId();
        this.roomName = favorite.getRoom().getTitle();
        this.roomImg = favorite.getRoom().getRoomImg().getImageUrl();
        this.likedAt = favorite.getLikedAt();
    }
}
