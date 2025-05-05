package com.freelanceproject.review_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reviewerId;  // The user who gives the review
    private Long reviewedId;  // The user being reviewed
    private String comment;

    @Column(nullable = false)
    private int rating; // Rating from 1 to 5

    private LocalDateTime createdAt;
}
