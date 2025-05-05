package com.freelanceproject.authorization_authentication.repository;


import com.freelanceproject.authorization_authentication.model.Role;
import com.freelanceproject.authorization_authentication.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    List<UserEntity> findByRole(Role role);
}
