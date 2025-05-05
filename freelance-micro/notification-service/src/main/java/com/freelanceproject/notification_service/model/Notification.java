package com.freelanceproject.notification_service.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String subject;
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;  // Renamed from 'read' to 'isRead'

    private Long userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
