package com.campusstay.repository;

import com.campusstay.entity.OwnerVerification;
import com.campusstay.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerVerificationRepository extends JpaRepository<OwnerVerification, Long> {
    Optional<OwnerVerification> findByUserId(Long userId);
    List<OwnerVerification> findByVerificationStatus(VerificationStatus status);
    List<OwnerVerification> findAllByOrderBySubmittedAtDesc();
}

