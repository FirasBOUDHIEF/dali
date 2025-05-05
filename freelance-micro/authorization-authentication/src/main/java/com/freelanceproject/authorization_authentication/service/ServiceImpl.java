package com.freelanceproject.authorization_authentication.service;

import com.freelanceproject.authorization_authentication.model.LoginResponseDTO;
import com.freelanceproject.authorization_authentication.model.UserEntity;
import com.freelanceproject.authorization_authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceImpl {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtEncoder jwtEncoder;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserEntity registerUser(UserEntity user){
        Optional<UserEntity> userEntity = userRepository.findByUsername(user.getUsername());
        if (userEntity.isPresent()){
            throw new RuntimeException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole());
        userRepository.save(user);

        return user;
    }

    public Map<String, Object> login(String username, String password) {
        Optional<UserEntity> userEntity = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        if (!userEntity.isPresent()){
            response.put("status", "User Not Found");
            return response;
        }
        LoginResponseDTO responseDTO = new LoginResponseDTO(userEntity.get().getId(), userEntity.get().getUsername(), userEntity.get().getEmail(), userEntity.get().getFirstName(), userEntity.get().getLastName(), userEntity.get().getAccount_type(), userEntity.get().getRole(), userEntity.get().getImageFilename(), userEntity.get().getCompleted());
        String accessToken = generateToken(userEntity.get(), authentication, 36000000);
        response.put("access_token", accessToken);
        response.put("expires_in", 36000000);
        response.put("user", responseDTO);
        return response;
    }

    private String generateToken(UserEntity userEntity, Authentication authentication, long expiryDuration){
        Instant now = Instant.now();
        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("Ornate")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiryDuration))
                .subject(authentication.getName())
                .claim("role", authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toSet()))
                .claim("userId", userEntity.getId())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();

    }
}
