package com.fitai.workout.service;

import com.fitai.workout.dto.*;
import com.fitai.workout.entity.User;
import com.fitai.workout.repository.UserRepository;
import com.fitai.workout.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already registered");
                }

                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .age(request.getAge())
                                .gender(request.getGender())
                                .height(request.getHeight())
                                .weight(request.getWeight())
                                .build();

                user = userRepository.save(user);

                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

                return AuthResponse.builder()
                                .token(token)
                                .email(user.getEmail())
                                .name(user.getName())
                                .role(user.getRole().name())
                                .userId(user.getId())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

                return AuthResponse.builder()
                                .token(token)
                                .email(user.getEmail())
                                .name(user.getName())
                                .role(user.getRole().name())
                                .userId(user.getId())
                                .build();
        }

        public UserProfileResponse getProfile(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return UserProfileResponse.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .age(user.getAge())
                                .gender(user.getGender())
                                .height(user.getHeight())
                                .weight(user.getWeight())
                                .role(user.getRole().name())
                                .build();
        }

        public UserProfileResponse updateProfile(String email, RegisterRequest request) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.setName(request.getName());
                user.setAge(request.getAge());
                user.setGender(request.getGender());
                user.setHeight(request.getHeight());
                user.setWeight(request.getWeight());
                user = userRepository.save(user);

                return UserProfileResponse.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .age(user.getAge())
                                .gender(user.getGender())
                                .height(user.getHeight())
                                .weight(user.getWeight())
                                .role(user.getRole().name())
                                .build();
        }
}
