package com.campusstay.service;

import com.campusstay.dto.DashboardStatsDto;
import com.campusstay.entity.BookingStatus;
import com.campusstay.entity.PropertyStatus;
import com.campusstay.entity.Role;
import com.campusstay.repository.BookingRepository;
import com.campusstay.repository.PropertyRepository;
import com.campusstay.repository.SavedPropertyRepository;
import com.campusstay.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final SavedPropertyRepository savedPropertyRepository;

    public DashboardService(UserRepository userRepository,
                            PropertyRepository propertyRepository,
                            BookingRepository bookingRepository,
                            SavedPropertyRepository savedPropertyRepository) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.bookingRepository = bookingRepository;
        this.savedPropertyRepository = savedPropertyRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getAdminDashboardStats() {
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        dto.setTotalOwners(userRepository.countByRole(Role.OWNER));
        dto.setTotalProperties(propertyRepository.count());
        dto.setApprovedProperties(propertyRepository.countByStatus(PropertyStatus.APPROVED));
        dto.setPendingProperties(propertyRepository.countByStatus(PropertyStatus.PENDING));
        dto.setRejectedProperties(propertyRepository.countByStatus(PropertyStatus.REJECTED));
        dto.setTotalBookings(bookingRepository.count());
        dto.setPendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING));
        dto.setAcceptedBookings(bookingRepository.countByStatus(BookingStatus.ACCEPTED));
        return dto;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getOwnerDashboardStats(Long ownerId) {
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setMyPropertiesCount(propertyRepository.countByOwnerId(ownerId));
        dto.setMyApprovedCount(propertyRepository.countByOwnerIdAndStatus(ownerId, PropertyStatus.APPROVED));
        dto.setMyPendingCount(propertyRepository.countByOwnerIdAndStatus(ownerId, PropertyStatus.PENDING));

        Integer availableRooms = propertyRepository.sumAvailableRoomsByOwnerId(ownerId);
        dto.setMyAvailableRooms(availableRooms != null ? availableRooms : 0);

        dto.setMyTotalBookingsCount(bookingRepository.countByPropertyOwnerId(ownerId));
        dto.setMyPendingBookingsCount(bookingRepository.countByPropertyOwnerIdAndStatus(ownerId, BookingStatus.PENDING));
        return dto;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getStudentDashboardStats(Long studentId) {
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setSavedPropertiesCount((long) savedPropertyRepository.findByStudentIdOrderByCreatedAtDesc(studentId).size());
        dto.setActiveBookingsCount((long) bookingRepository.findByStudentIdOrderByCreatedAtDesc(studentId).size());
        return dto;
    }
}

