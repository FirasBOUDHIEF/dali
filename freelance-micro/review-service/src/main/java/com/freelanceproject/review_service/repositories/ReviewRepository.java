package com.freelanceproject.review_service.repositories;

import com.freelanceproject.review_service.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewedId(Long reviewedId);
}