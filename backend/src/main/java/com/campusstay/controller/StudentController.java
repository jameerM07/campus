package com.campusstay.controller;

import com.campusstay.dto.ApiResponse;
import com.campusstay.dto.BookingRequestDto;
import com.campusstay.dto.BookingResponseDto;
import com.campusstay.dto.DashboardStatsDto;
import com.campusstay.dto.PropertyResponse;
import com.campusstay.entity.Notification;
import com.campusstay.entity.User;
import com.campusstay.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final AuthService authService;
    private final BookingService bookingService;
    private final PropertyService propertyService;
    private final DashboardService dashboardService;
    private final NotificationService notificationService;

    public StudentController(AuthService authService,
                             BookingService bookingService,
                             PropertyService propertyService,
                             DashboardService dashboardService,
                             NotificationService notificationService) {
        this.authService = authService;
        this.bookingService = bookingService;
        this.propertyService = propertyService;
        this.dashboardService = dashboardService;
        this.notificationService = notificationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        User student = authService.getCurrentAuthenticatedUser();
        DashboardStatsDto stats = dashboardService.getStudentDashboardStats(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(@Valid @RequestBody BookingRequestDto request) {
        User student = authService.getCurrentAuthenticatedUser();
        BookingResponseDto booking = bookingService.createBookingRequest(request, student);
        return ResponseEntity.ok(ApiResponse.ok("Booking request sent successfully to the property owner", booking));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getMyBookings() {
        User student = authService.getCurrentAuthenticatedUser();
        List<BookingResponseDto> bookings = bookingService.getStudentBookings(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponseDto>> cancelBooking(@PathVariable Long id) {
        User student = authService.getCurrentAuthenticatedUser();
        BookingResponseDto booking = bookingService.cancelBookingByStudent(id, student.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking request cancelled", booking));
    }

    @PostMapping("/saved/{propertyId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleSaveProperty(@PathVariable Long propertyId) {
        User student = authService.getCurrentAuthenticatedUser();
        boolean isSaved = propertyService.toggleSavedProperty(propertyId, student);
        String msg = isSaved ? "Property added to saved stays" : "Property removed from saved stays";
        return ResponseEntity.ok(ApiResponse.ok(msg, Map.of("saved", isSaved, "propertyId", propertyId)));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getSavedProperties() {
        User student = authService.getCurrentAuthenticatedUser();
        List<PropertyResponse> list = propertyService.getSavedPropertiesForStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications() {
        User student = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getUserNotifications(student.getId())));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(@PathVariable Long id) {
        User student = authService.getCurrentAuthenticatedUser();
        notificationService.markAsRead(id, student.getId());
        return ResponseEntity.ok(ApiResponse.ok("Marked as read"));
    }

    @PatchMapping("/notifications/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsRead() {
        User student = authService.getCurrentAuthenticatedUser();
        notificationService.markAllAsRead(student.getId());
        return ResponseEntity.ok(ApiResponse.ok("All marked as read"));
    }
}

