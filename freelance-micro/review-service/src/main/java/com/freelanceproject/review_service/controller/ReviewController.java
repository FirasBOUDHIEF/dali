package com.freelanceproject.review_service.controller;


import com.freelanceproject.review_service.model.Review;
import com.freelanceproject.review_service.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reviews")
@CrossOrigin("*")

public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{reviewedId}")
    public List<Review> getReviewsForUser(@PathVariable Long reviewedId) {
        return reviewService.getReviewsForUser(reviewedId);
    }

    @GetMapping("/average/{reviewedId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long reviewedId) {
        return ResponseEntity.ok(reviewService.getAverageRating(reviewedId));
    }

    @PostMapping
    public Review submitReview(@RequestBody Review review) {
        return reviewService.submitReview(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
