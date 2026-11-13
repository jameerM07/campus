package com.campusstay.repository;

import com.campusstay.entity.SavedProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {
    List<SavedProperty> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Optional<SavedProperty> findByStudentIdAndPropertyId(Long studentId, Long propertyId);
    void deleteByStudentIdAndPropertyId(Long studentId, Long propertyId);
    Boolean existsByStudentIdAndPropertyId(Long studentId, Long propertyId);
}

