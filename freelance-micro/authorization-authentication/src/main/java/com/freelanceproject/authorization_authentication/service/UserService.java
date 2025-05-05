package com.freelanceproject.authorization_authentication.service;

import com.freelanceproject.authorization_authentication.model.*;
import com.freelanceproject.authorization_authentication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserEntity createUser(Long id, UserEntity updatedUser) {
        Optional<UserEntity> existingUserOptional = userRepository.findById(id);

        if (existingUserOptional.isPresent()) {
            UserEntity existingUser = existingUserOptional.get();

            // Update fields
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setBirthDate(updatedUser.getBirthDate());
            existingUser.setCompleted(updatedUser.getCompleted());

            //Update Competences
            if (updatedUser.getCompetences() != null) {
                existingUser.getCompetences().clear();
                for (Competence competence : updatedUser.getCompetences()) {
                    competence.setUser(existingUser);
                    existingUser.getCompetences().add(competence);
                }
            }

            // Update Formations
            if (updatedUser.getFormations() != null) {
                existingUser.getFormations().clear();
                for (Formation formation : updatedUser.getFormations()) {
                    formation.setUser(existingUser);
                    existingUser.getFormations().add(formation);
                }
            }

            // Update Experiences
            if (updatedUser.getExperiences() != null) {
                existingUser.getExperiences().clear();
                for (Experience experience : updatedUser.getExperiences()) {
                    experience.setUser(existingUser);
                    existingUser.getExperiences().add(experience);
                }
            }

            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }
    public List<UserEntity> findbyrole(Role role) {
        return userRepository.findByRole(role);
    }

    public UserEntity updateUser(Long id, UserEntity userDTO) {
        UserEntity existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setUsername(userDTO.getUsername());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setRole(userDTO.getRole());

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}