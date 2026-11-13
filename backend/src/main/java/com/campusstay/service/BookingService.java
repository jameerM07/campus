package com.campusstay.service;

import com.campusstay.dto.BookingRequestDto;
import com.campusstay.dto.BookingResponseDto;
import com.campusstay.dto.BookingStatusUpdateRequest;
import com.campusstay.entity.*;
import com.campusstay.repository.BookingRepository;
import com.campusstay.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          PropertyRepository propertyRepository,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public BookingResponseDto createBookingRequest(BookingRequestDto request, User student) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + request.getPropertyId()));

        if (property.getStatus() != PropertyStatus.APPROVED) {
            throw new IllegalStateException("Cannot book a property that is not approved.");
        }

        if (property.getAvailableRooms() <= 0) {
            throw new IllegalStateException("No rooms currently available for this property.");
        }

        if (property.getOwner().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Owners cannot book their own property.");
        }

        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setStudent(student);
        booking.setExpectedMoveInDate(request.getExpectedMoveInDate());
        booking.setMessage(request.getMessage());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Notify property owner
        notificationService.createNotification(
                property.getOwner(),
                "New Booking Request Received",
                "Student " + student.getFullName() + " requested to book a stay at \"" + property.getTitle() + "\" for " + request.getExpectedMoveInDate() + ".",
                "BOOKING",
                saved.getId()
        );

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getStudentBookings(Long studentId) {
        return bookingRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByPropertyOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getAllBookingsForAdmin() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateRequest request, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (!booking.getProperty().getOwner().getId().equals(ownerId)) {
            throw new SecurityException("Unauthorized to update this booking request");
        }

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(request.getStatus());
        if (request.getOwnerNotes() != null) {
            booking.setOwnerNotes(request.getOwnerNotes().trim());
        }

        // If newly accepted, reduce available rooms
        if (request.getStatus() == BookingStatus.ACCEPTED && oldStatus != BookingStatus.ACCEPTED) {
            Property prop = booking.getProperty();
            if (prop.getAvailableRooms() > 0) {
                prop.setAvailableRooms(prop.getAvailableRooms() - 1);
                propertyRepository.save(prop);
            }
        } else if (oldStatus == BookingStatus.ACCEPTED && request.getStatus() != BookingStatus.ACCEPTED) {
            // Restore available room
            Property prop = booking.getProperty();
            prop.setAvailableRooms(prop.getAvailableRooms() + 1);
            propertyRepository.save(prop);
        }

        Booking updated = bookingRepository.save(booking);

        // Notify student
        String noteMsg = (booking.getOwnerNotes() != null && !booking.getOwnerNotes().isEmpty())
                ? " Note from owner: \"" + booking.getOwnerNotes() + "\""
                : "";

        if (request.getStatus() == BookingStatus.ACCEPTED) {
            notificationService.createNotification(
                    booking.getStudent(),
                    "Booking Accepted! 🎉",
                    "Your booking request for \"" + booking.getProperty().getTitle() + "\" was accepted by the owner!" + noteMsg,
                    "BOOKING",
                    booking.getId()
            );
        } else if (request.getStatus() == BookingStatus.REJECTED) {
            notificationService.createNotification(
                    booking.getStudent(),
                    "Booking Update",
                    "Your booking request for \"" + booking.getProperty().getTitle() + "\" was declined." + noteMsg,
                    "BOOKING",
                    booking.getId()
            );
        }

        return mapToDto(updated);
    }

    @Transactional
    public BookingResponseDto cancelBookingByStudent(Long bookingId, Long studentId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (!booking.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.ACCEPTED) {
            // Restore room availability
            Property prop = booking.getProperty();
            prop.setAvailableRooms(prop.getAvailableRooms() + 1);
            propertyRepository.save(prop);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        // Notify owner
        notificationService.createNotification(
                booking.getProperty().getOwner(),
                "Booking Cancelled",
                "Student " + booking.getStudent().getFullName() + " cancelled their booking request for \"" + booking.getProperty().getTitle() + "\".",
                "BOOKING",
                booking.getId()
        );

        return mapToDto(updated);
    }

    private BookingResponseDto mapToDto(Booking b) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(b.getId());
        dto.setPropertyId(b.getProperty().getId());
        dto.setPropertyTitle(b.getProperty().getTitle());
        dto.setPropertyAddress(b.getProperty().getAddress() + ", " + b.getProperty().getCity());
        dto.setMonthlyRent(b.getProperty().getMonthlyRent());

        if (b.getProperty().getImages() != null && !b.getProperty().getImages().isEmpty()) {
            dto.setPropertyImageUrl(b.getProperty().getImages().get(0).getImageUrl());
        }

        // Owner details
        if (b.getProperty().getOwner() != null) {
            dto.setOwnerName(b.getProperty().getOwner().getFullName());
            dto.setOwnerPhone(b.getProperty().getOwner().getPhoneNumber());
            dto.setOwnerEmail(b.getProperty().getOwner().getEmail());
        }

        // Student details
        if (b.getStudent() != null) {
            dto.setStudentId(b.getStudent().getId());
            dto.setStudentName(b.getStudent().getFullName());
            dto.setStudentEmail(b.getStudent().getEmail());
            dto.setStudentPhone(b.getStudent().getPhoneNumber());
            dto.setCollegeName(b.getStudent().getCollegeName());
            dto.setCourse(b.getStudent().getCourse());
            dto.setYearOfStudy(b.getStudent().getYearOfStudy());
        }

        dto.setExpectedMoveInDate(b.getExpectedMoveInDate());
        dto.setMessage(b.getMessage());
        dto.setStatus(b.getStatus());
        dto.setOwnerNotes(b.getOwnerNotes());
        dto.setCreatedAt(b.getCreatedAt());
        dto.setUpdatedAt(b.getUpdatedAt());

        return dto;
    }
}

