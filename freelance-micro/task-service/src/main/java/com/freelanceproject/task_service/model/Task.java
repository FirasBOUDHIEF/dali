package com.freelanceproject.task_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private Long clientId;  // The client who created the task
    private Long freelancerId;  // The freelancer assigned (nullable)

    private String budgetType; // "fixed" or "hourly"
    private int minAmount;
    private int maxAmount;
    private String currency; // e.g., "entry", "mid", "expert"

    private String category;


    @CreatedDate  // Auto-fills when the entity is created
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate  // Auto-updates when the entity is modified
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskCompetance> competences;

    public void setCompetences(List<TaskCompetance> competences) {
        this.competences = competences;
        if (competences != null) {
            for (TaskCompetance competence : competences) {
                competence.setTask(this);  // Ensure the relationship is set
            }
        }
    }
}
