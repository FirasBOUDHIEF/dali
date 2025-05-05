package com.freelanceproject.task_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long taskid;

    private Long freelanceid;

    private String motivation ;
    private String freelancerEmail;
    private Boolean confirmed;

    @Column(name = "cv_filename")
    private Boolean  withCv;
}
