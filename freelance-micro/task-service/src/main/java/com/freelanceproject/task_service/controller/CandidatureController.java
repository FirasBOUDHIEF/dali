package com.freelanceproject.task_service.controller;

import com.freelanceproject.task_service.model.Candidature;
import com.freelanceproject.task_service.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/candidatures")
@RequiredArgsConstructor
@CrossOrigin("*")

public class CandidatureController {

    private final CandidatureService candidatureService;

    @GetMapping
    public ResponseEntity<List<Candidature>> getAllCandidatures() {
        return ResponseEntity.ok(candidatureService.getAllCandidatures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidature> getCandidatureById(@PathVariable Long id) {
        Optional<Candidature> candidature = candidatureService.getCandidatureById(id);
        return candidature.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Candidature>> getCandidaturesByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByTaskId(taskId));
    }

    @GetMapping("/freelance/{freelanceId}")
    public ResponseEntity<List<Candidature>> getCandidaturesByFreelanceId(@PathVariable Long freelanceId) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByFreelanceId(freelanceId));
    }

    @PostMapping
    public ResponseEntity<Candidature> createCandidature(@RequestBody Candidature candidature) {
        return ResponseEntity.ok(candidatureService.createCandidature(candidature));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidature> updateCandidature(@PathVariable Long id, @RequestBody Candidature candidature) {
        return ResponseEntity.ok(candidatureService.updateCandidature(id, candidature));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Candidature> confirmCandidature(@PathVariable Long id) {
        return ResponseEntity.ok(candidatureService.confirmCandidature(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidature(@PathVariable Long id) {
        candidatureService.deleteCandidature(id);
        return ResponseEntity.noContent().build();
    }
}
