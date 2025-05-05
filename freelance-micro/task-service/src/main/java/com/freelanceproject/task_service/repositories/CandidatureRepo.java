package com.freelanceproject.task_service.repositories;

import com.freelanceproject.task_service.model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatureRepo extends JpaRepository<Candidature, Long> {

    List<Candidature> findByTaskid(Long id);
    List<Candidature> findByFreelanceid(Long id);
}
