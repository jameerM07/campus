package com.campusstay.repository;

import com.campusstay.entity.Property;
import com.campusstay.entity.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findAllByStatus(PropertyStatus status);
    List<Property> findByOwnerId(Long ownerId);
    List<Property> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    Long countByStatus(PropertyStatus status);
    Long countByOwnerId(Long ownerId);
    Long countByOwnerIdAndStatus(Long ownerId, PropertyStatus status);
    
    @Query("SELECT p FROM Property p WHERE p.status = 'APPROVED' AND p.availableRooms > 0")
    List<Property> findAllApprovedAndAvailable();

    @Query("SELECT SUM(p.availableRooms) FROM Property p WHERE p.owner.id = :ownerId")
    Integer sumAvailableRoomsByOwnerId(@Param("ownerId") Long ownerId);
}

