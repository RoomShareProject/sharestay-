package com.example.sharestay;


import com.example.sharestay.repository.FavoriteRepository;
import com.example.sharestay.repository.HostRepository;
import com.example.sharestay.entity.User;
import com.example.sharestay.repository.RoomRepository;
import com.example.sharestay.repository.UserRepository;
import com.example.sharestay.entity.*;


import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
@RequiredArgsConstructor
public class SharestayApplication implements CommandLineRunner {
    private final UserRepository userRepository;
    private final HostRepository hostRepository;
    private final RoomRepository roomRepository;
    private final FavoriteRepository favoriteRepository;

    public static void main(String[] args) {
        SpringApplication.run(SharestayApplication.class, args);
    }

    @Override
    public void run(String... args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        if (userRepository.existsByUsername("kim1@test.com")) {
            return;
        }

        User user = new User(
                "kim1@test.com",
                encoder.encode("user1234"),
                "LOCAL",
                "도하 킴",
                "인천, 대한민국",
                "010-1234-5678",
                "ADMIN",
                "금연 · 반려동물 없음 · 조용한 활동 선호"
        );
        userRepository.save(user);


        Host host1 = new Host(
                "깨끗한 방을 좋아하는 호스트입니다.",  // introduction
                true,                                 // termsAgreed
                user                                  // user (연결된 User)
        );

        // Room 객체 생성
        Room room = new Room(
                host1,                          // 어떤 호스트가 등록한 방인지
                "홍대입구 근처 원룸",             // title
                55.5,                           // rentPrice
                "서울특별시 마포구 서교동 12-3",    // address
                "원룸",                          // type
                37.557123,                      // latitude (위도)
                126.923456,                     // longitude (경도)
                2,                              // availabilityStatus (최대 인원)
                "깔끔하고 교통 좋은 원룸입니다."      // description
        );


        List<Room> roomList = new ArrayList<>();

        // 부산 전역 구 + 동 + 랜덤 위도/경도 범위
        Map<String, Object[]> REGION_DATA = new HashMap<>() {{
            put("부산진구", new Object[]{"부전동,전포동,가야동,당감동".split(","), 35.149, 35.175, 129.040, 129.070});
            put("해운대구", new Object[]{"우동,중동,좌동,송정동".split(","), 35.155, 35.230, 129.110, 129.190});
            put("동래구", new Object[]{"명륜동,온천동,사직동".split(","), 35.185, 35.215, 129.060, 129.100});
            put("남구", new Object[]{"대연동,용호동,문현동".split(","), 35.120, 35.150, 129.070, 129.105});
            put("수영구", new Object[]{"민락동,광안동,남천동".split(","), 35.135, 35.170, 129.100, 129.130});
            put("북구", new Object[]{"구포동,덕천동,화명동".split(","), 35.205, 35.265, 128.990, 129.030});
            put("사상구", new Object[]{"감전동,덕포동,주례동".split(","), 35.140, 35.180, 128.980, 129.020});
            put("사하구", new Object[]{"하단동,신평동,장림동".split(","), 35.070, 35.110, 128.960, 129.010});
            put("강서구", new Object[]{"명지동,신호동,대저동".split(","), 35.085, 35.210, 128.810, 128.960});
            put("연제구", new Object[]{"연산동".split(","), 35.170, 35.205, 129.060, 129.090});
            put("동구", new Object[]{"초량동,수정동".split(","), 35.125, 35.150, 129.040, 129.065});
            put("서구", new Object[]{"부민동,아미동".split(","), 35.085, 35.130, 129.010, 129.040});
            put("영도구", new Object[]{"봉래동,영선동".split(","), 35.060, 35.100, 129.040, 129.080});
            put("중구", new Object[]{"남포동,광복동".split(","), 35.095, 35.115, 129.025, 129.040});
            put("금정구", new Object[]{"장전동,구서동".split(","), 35.230, 35.285, 129.055, 129.110});
            put("기장군", new Object[]{"정관읍,일광읍,기장읍".split(","), 35.235, 35.330, 129.170, 129.260});
        }};

        String[] TYPES = {"ONE_ROOM", "TWO_ROOM", "OFFICETEL", "APARTMENT"};

        for (int i = 1; i <= 200; i++) {
            // 🔥 랜덤 구 선택
            List<String> keys = new ArrayList<>(REGION_DATA.keySet());
            String gu = keys.get((int) (Math.random() * keys.size()));

            Object[] regionInfo = REGION_DATA.get(gu);

            String[] dongs = (String[]) regionInfo[0];
            double minLat = (double) regionInfo[1];
            double maxLat = (double) regionInfo[2];
            double minLng = (double) regionInfo[3];
            double maxLng = (double) regionInfo[4];

            String dong = dongs[(int) (Math.random() * dongs.length)];

            double lat = minLat + Math.random() * (maxLat - minLat);
            double lng = minLng + Math.random() * (maxLng - minLng);

            String type = TYPES[(int) (Math.random() * TYPES.length)];

            Room room1 = new Room(
                    host1,
                    gu + " " + dong + " 랜덤 방 " + i,
                    300000 + (int)(Math.random() * 900000),
                    "부산광역시 " + gu + " " + dong + " " + i + "-1",
                    type,
                    lat,
                    lng,
                    1 + (int)(Math.random() * 3),
                    "부산 전역 랜덤 더미 데이터입니다."
            );

            roomList.add(room1);
        }
        hostRepository.save(host1);
        roomRepository.save(room);

        roomRepository.saveAll(roomList);

        // Favorite 객체 생성
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setRoom(room);
        favoriteRepository.save(favorite);

    }
}
