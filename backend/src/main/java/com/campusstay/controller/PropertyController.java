package com.campusstay.controller;

import com.campusstay.dto.ApiResponse;
import com.campusstay.dto.PropertyResponse;
import com.campusstay.dto.SearchFilterRequest;
import com.campusstay.entity.User;
import com.campusstay.service.AuthService;
import com.campusstay.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final AuthService authService;

    public PropertyController(PropertyService propertyService, AuthService authService) {
        this.propertyService = propertyService;
        this.authService = authService;
    }

    /**
     * Core 5 KM radius search endpoint.
     * Accessible by students, unauthenticated guests, or any user.
     * The 5 KM restriction is strictly enforced by the backend service.
     */
    @PostMapping("/public/search")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> searchProperties(@RequestBody SearchFilterRequest filter) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        List<PropertyResponse> properties = propertyService.searchProperties(filter, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved " + properties.size() + " properties within 5 KM radius", properties));
    }

    @GetMapping("/public/featured")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getFeaturedProperties() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        List<PropertyResponse> featured = propertyService.getFeaturedProperties(currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(featured));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyDetails(
            @PathVariable Long id,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLng) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        PropertyResponse property = propertyService.getPropertyDetails(id, userLat, userLng, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(property));
    }
}

