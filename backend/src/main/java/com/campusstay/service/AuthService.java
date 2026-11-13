package com.campusstay.service;

import com.campusstay.dto.AuthRequest;
import com.campusstay.dto.AuthResponse;
import com.campusstay.dto.OwnerRegisterRequest;
import com.campusstay.dto.StudentRegisterRequest;
import com.campusstay.entity.*;
import com.campusstay.repository.OwnerVerificationRepository;
import com.campusstay.repository.UserRepository;
import com.campusstay.security.JwtUtils;
import com.campusstay.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OwnerVerificationRepository ownerVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       OwnerVerificationRepository ownerVerificationRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.ownerVerificationRepository = ownerVerificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setRole(Role.STUDENT);
        user.setCollegeName(request.getCollegeName().trim());
        user.setCourse(request.getCourse());
        user.setYearOfStudy(request.getYearOfStudy());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setStatus(UserStatus.ACTIVE);

        user = userRepository.save(user);

        // Auto authenticate and generate token
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String jwt = jwtUtils.generateJwtToken(userDetails);

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCollegeName(),
                user.getPhoneNumber()
        );
    }

    @Transactional
    public AuthResponse registerOwner(OwnerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setRole(Role.OWNER);
        user.setAddress(request.getAddress().trim());
        user.setStatus(UserStatus.ACTIVE);

        user = userRepository.save(user);

        // Create initial verification record
        OwnerVerification verification = new OwnerVerification(
                user,
                request.getDocumentType(),
                request.getDocumentNumber(),
                request.getDocumentUrl()
        );
        ownerVerificationRepository.save(verification);

        // Auto authenticate and generate token
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String jwt = jwtUtils.generateJwtToken(userDetails);

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                null,
                user.getPhoneNumber()
        );
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // If specific role requested, verify role matches
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            String expectedRole = request.getRole().toUpperCase().replace("ROLE_", "");
            if (!userDetails.getRole().name().equalsIgnoreCase(expectedRole)) {
                throw new BadCredentialsException("Account role mismatch. You cannot log in as " + request.getRole() + " with this account.");
            }
        }

        String jwt = jwtUtils.generateJwtToken(userDetails);

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFullName(),
                userDetails.getRole(),
                userDetails.getCollegeName(),
                userDetails.getPhoneNumber()
        );
    }

    public User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
            return null;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return userRepository.findById(userDetails.getId()).orElse(null);
    }
}

