package com.campusstay.controller;

import com.campusstay.dto.*;
import com.campusstay.entity.*;
import com.campusstay.repository.OwnerVerificationRepository;
import com.campusstay.repository.UserRepository;
import com.campusstay.service.BookingService;
import com.campusstay.service.DashboardService;
import com.campusstay.service.NotificationService;
import com.campusstay.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;
    private final PropertyService propertyService;
    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final OwnerVerificationRepository ownerVerificationRepository;
    private final NotificationService notificationService;

    public AdminController(DashboardService dashboardService,
                           PropertyService propertyService,
                           BookingService bookingService,
                           UserRepository userRepository,
                           OwnerVerificationRepository ownerVerificationRepository,
                           NotificationService notificationService) {
        this.dashboardService = dashboardService;
        this.propertyService = propertyService;
        this.bookingService = bookingService;
        this.userRepository = userRepository;
        this.ownerVerificationRepository = ownerVerificationRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getAdminDashboardStats()));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getAllProperties() {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getAllPropertiesForAdmin()));
    }

    @GetMapping("/properties/pending")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getPendingProperties() {
        return ResponseEntity.ok(ApiResponse.ok(propertyService.getPendingProperties()));
    }

    @PatchMapping("/properties/{id}/approve")
    public ResponseEntity<ApiResponse<PropertyResponse>> approveProperty(@PathVariable Long id) {
        PropertyResponse approved = propertyService.approveProperty(id);
        return ResponseEntity.ok(ApiResponse.ok("Property approved and published successfully", approved));
    }

    @PatchMapping("/properties/{id}/reject")
    public ResponseEntity<ApiResponse<PropertyResponse>> rejectProperty(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "Listing does not satisfy quality standards");
        PropertyResponse rejected = propertyService.rejectProperty(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Property rejected", rejected));
    }

    @DeleteMapping("/properties/{id}")
    public ResponseEntity<ApiResponse<Void>> removePropertyListing(@PathVariable Long id) {
        propertyService.deletePropertyByAdmin(id);
        return ResponseEntity.ok(ApiResponse.ok("Property removed by administrator"));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<User>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.ok(userRepository.findAllByRole(Role.STUDENT)));
    }

    @GetMapping("/owners")
    public ResponseEntity<ApiResponse<List<User>>> getAllOwners() {
        return ResponseEntity.ok(ApiResponse.ok(userRepository.findAllByRole(Role.OWNER)));
    }

    @GetMapping("/verifications")
    public ResponseEntity<ApiResponse<List<OwnerVerification>>> getAllVerifications() {
        return ResponseEntity.ok(ApiResponse.ok(ownerVerificationRepository.findAllByOrderBySubmittedAtDesc()));
    }

    @PatchMapping("/verifications/{id}/verify")
    public ResponseEntity<ApiResponse<OwnerVerification>> verifyOwner(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        OwnerVerification verification = ownerVerificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Verification record not found"));

        boolean approved = Boolean.TRUE.equals(payload.get("approved"));
        String reason = (String) payload.get("reason");

        if (approved) {
            verification.setVerificationStatus(VerificationStatus.VERIFIED);
            verification.setRejectionReason(null);
            notificationService.createNotification(
                    verification.getUser(),
                    "Owner Account Verified",
                    "Your owner profile and identity documents have been verified by Campus Stay admin.",
                    "VERIFICATION",
                    verification.getId()
            );
        } else {
            verification.setVerificationStatus(VerificationStatus.REJECTED);
            verification.setRejectionReason(reason != null ? reason : "Identity documents unverified");
            notificationService.createNotification(
                    verification.getUser(),
                    "Verification Update",
                    "Your verification could not be approved. Reason: " + verification.getRejectionReason(),
                    "VERIFICATION",
                    verification.getId()
            );
        }

        verification.setReviewedAt(LocalDateTime.now());
        OwnerVerification saved = ownerVerificationRepository.save(verification);
        return ResponseEntity.ok(ApiResponse.ok("Verification status updated", saved));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String statusStr = payload.get("status");
        if (statusStr != null) {
            user.setStatus(UserStatus.valueOf(statusStr.toUpperCase()));
            userRepository.save(user);
        }

        return ResponseEntity.ok(ApiResponse.ok("User status updated", user));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getAllBookingsForAdmin()));
    }
}

