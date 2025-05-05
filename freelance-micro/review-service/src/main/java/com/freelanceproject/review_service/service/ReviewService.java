package com.freelanceproject.review_service.service;

import com.freelanceproject.review_service.model.Review;
import com.freelanceproject.review_service.repositories.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.DoubleSummaryStatistics;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getReviewsForUser(Long reviewedId) {
        return reviewRepository.findByReviewedId(reviewedId);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public Review submitReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public double getAverageRating(Long reviewedId) {
        List<Review> reviews = reviewRepository.findByReviewedId(reviewedId);
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
