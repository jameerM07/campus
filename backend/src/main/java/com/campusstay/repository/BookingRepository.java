package com.campusstay.repository;

import com.campusstay.entity.Booking;
import com.campusstay.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Booking> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Booking> findByPropertyId(Long propertyId);
    Long countByStatus(BookingStatus status);
    Long countByPropertyOwnerId(Long ownerId);
    Long countByPropertyOwnerIdAndStatus(Long ownerId, BookingStatus status);
    List<Booking> findAllByOrderByCreatedAtDesc();
}

