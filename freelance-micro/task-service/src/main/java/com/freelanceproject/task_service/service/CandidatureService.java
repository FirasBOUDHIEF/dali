package com.freelanceproject.task_service.service;


import com.freelanceproject.task_service.model.Candidature;
import com.freelanceproject.task_service.model.Task;
import com.freelanceproject.task_service.model.TaskStatus;
import com.freelanceproject.task_service.repositories.CandidatureRepo;
import com.freelanceproject.task_service.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidatureService {
    private final CandidatureRepo candidatureRepo;
    private final TaskRepository taskRepository;

    public CandidatureService(CandidatureRepo candidatureRepo, TaskRepository taskRepository) {
        this.candidatureRepo = candidatureRepo;
        this.taskRepository = taskRepository;
    }

    public List<Candidature> getAllCandidatures() {
        return candidatureRepo.findAll();
    }

    public Optional<Candidature> getCandidatureById(Long id) {
        return candidatureRepo.findById(id);
    }

    public List<Candidature> getCandidaturesByTaskId(Long taskId) {
        return candidatureRepo.findByTaskid(taskId);
    }

    public List<Candidature> getCandidaturesByFreelanceId(Long freelanceId) {
        return candidatureRepo.findByFreelanceid(freelanceId);
    }

    public Candidature createCandidature(Candidature candidature) {
        return candidatureRepo.save(candidature);
    }

    public Candidature updateCandidature(Long id, Candidature candidatureDetails) {
        return candidatureRepo.findById(id).map(candidature -> {
            candidature.setTaskid(candidatureDetails.getTaskid());
            candidature.setFreelanceid(candidatureDetails.getFreelanceid());
            candidature.setMotivation(candidatureDetails.getMotivation());
            candidature.setConfirmed(candidatureDetails.getConfirmed());
            return candidatureRepo.save(candidature);
        }).orElseThrow(() -> new RuntimeException("Candidature not found"));
    }

    public Candidature confirmCandidature(Long id) {
        return candidatureRepo.findById(id).map(candidature -> {
            candidature.setConfirmed(true);
            Task task = taskRepository.findById(candidature.getTaskid()).get();
            task.setFreelancerId(candidature.getFreelanceid());
            task.setStatus(TaskStatus.IN_PROGRESS);
            taskRepository.save(task);
            return candidatureRepo.save(candidature);
        }).orElseThrow(() -> new RuntimeException("Candidature not found"));
    }

    public void deleteCandidature(Long id) {
        candidatureRepo.deleteById(id);
    }
}
