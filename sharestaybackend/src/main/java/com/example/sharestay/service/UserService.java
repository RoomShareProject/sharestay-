package com.example.sharestay.service;

import com.example.sharestay.domain.User;
import com.example.sharestay.domain.UserRepository;
import com.example.sharestay.dto.AuthResponse;
import com.example.sharestay.dto.SignupRequest;
import com.example.sharestay.dto.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .lifeStyle(request.getLifeStyle())
                .signupDate(new Date())
                .build();

        userRepository.save(user);

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        String accessToken = "fake-jwt-token-for-" + user.getUsername();
        String refreshToken = "fake-refresh-token";

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .nickname(user.getNickname())
                .role(user.getRole())
                .build();
    }

    public User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public User updateUser(String username, UpdateUserRequest request) {
        User user = getUser(username);

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getLifeStyle() != null) {
            user.setLifeStyle(request.getLifeStyle());
        }

        return userRepository.save(user);
    }
}
