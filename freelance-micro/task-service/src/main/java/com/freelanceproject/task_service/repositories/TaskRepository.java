package com.freelanceproject.task_service.repositories;

import com.freelanceproject.task_service.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByClientId(Long clientId);
    List<Task> findByFreelancerId(Long freelancerId);
}