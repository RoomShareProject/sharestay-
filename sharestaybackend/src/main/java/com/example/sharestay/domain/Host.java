package com.example.sharestay.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor(force = true)
public class Host {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false, name = "host_id")
    private Long id;

    @Column(nullable = false)
    private final String introduction;

    @Column(nullable = false)
    private final boolean terms_agreed;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")  // FK 컬럼 이름
    private User user;

    public Host(String introduction, boolean terms_agreed, User user) {
        this.introduction = introduction;
        this.terms_agreed = terms_agreed;
        this.user = user;
    }
}
