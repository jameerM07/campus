package com.campusstay.controller;

import com.campusstay.dto.*;
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
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    private final AuthService authService;
    private final PropertyService propertyService;
    private final BookingService bookingService;
    private final DashboardService dashboardService;
    private final NotificationService notificationService;

    public OwnerController(AuthService authService,
                           PropertyService propertyService,
                           BookingService bookingService,
                           DashboardService dashboardService,
                           NotificationService notificationService) {
        this.authService = authService;
        this.propertyService = propertyService;
        this.bookingService = bookingService;
        this.dashboardService = dashboardService;
        this.notificationService = notificationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        User owner = authService.getCurrentAuthenticatedUser();
        DashboardStatsDto stats = dashboardService.getOwnerDashboardStats(owner.getId());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getMyProperties() {
        User owner = authService.getCurrentAuthenticatedUser();
        List<PropertyResponse> properties = propertyService.getOwnerProperties(owner.getId());
        return ResponseEntity.ok(ApiResponse.ok(properties));
    }

    @PostMapping("/properties")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(@Valid @RequestBody PropertyRequest request) {
        User owner = authService.getCurrentAuthenticatedUser();
        PropertyResponse created = propertyService.createProperty(request, owner);
        return ResponseEntity.ok(ApiResponse.ok("Property submitted successfully! It is pending administrator verification.", created));
    }

    @PutMapping("/properties/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(@PathVariable Long id, @Valid @RequestBody PropertyRequest request) {
        User owner = authService.getCurrentAuthenticatedUser();
        PropertyResponse updated = propertyService.updateProperty(id, request, owner.getId());
        return ResponseEntity.ok(ApiResponse.ok("Property updated successfully", updated));
    }

    @DeleteMapping("/properties/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        User owner = authService.getCurrentAuthenticatedUser();
        propertyService.deleteProperty(id, owner.getId());
        return ResponseEntity.ok(ApiResponse.ok("Property deleted successfully"));
    }

    @PatchMapping("/properties/{id}/availability")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateAvailability(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        User owner = authService.getCurrentAuthenticatedUser();
        Integer availableRooms = payload.get("availableRooms");
        if (availableRooms == null || availableRooms < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Valid availableRooms count is required"));
        }
        PropertyResponse updated = propertyService.updateRoomAvailability(id, availableRooms, owner.getId());
        return ResponseEntity.ok(ApiResponse.ok("Available rooms updated successfully", updated));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getIncomingBookings() {
        User owner = authService.getCurrentAuthenticatedUser();
        List<BookingResponseDto> bookings = bookingService.getOwnerBookings(owner.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponseDto>> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        User owner = authService.getCurrentAuthenticatedUser();
        BookingResponseDto updated = bookingService.updateBookingStatus(id, request, owner.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated to " + request.getStatus(), updated));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications() {
        User owner = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getUserNotifications(owner.getId())));
    }
}

