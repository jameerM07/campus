package com.campusstay.service;

import com.campusstay.dto.PropertyRequest;
import com.campusstay.dto.PropertyResponse;
import com.campusstay.dto.SearchFilterRequest;
import com.campusstay.entity.*;
import com.campusstay.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final CollegeRepository collegeRepository;
    private final SavedPropertyRepository savedPropertyRepository;
    private final ReviewRepository reviewRepository;
    private final HaversineService haversineService;
    private final NotificationService notificationService;

    public PropertyService(PropertyRepository propertyRepository,
                           PropertyImageRepository propertyImageRepository,
                           CollegeRepository collegeRepository,
                           SavedPropertyRepository savedPropertyRepository,
                           ReviewRepository reviewRepository,
                           HaversineService haversineService,
                           NotificationService notificationService) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.collegeRepository = collegeRepository;
        this.savedPropertyRepository = savedPropertyRepository;
        this.reviewRepository = reviewRepository;
        this.haversineService = haversineService;
        this.notificationService = notificationService;
    }

    /**
     * Core 5 KM radius search workflow enforced strictly on backend.
     */
    @Transactional(readOnly = true)
    public List<PropertyResponse> searchProperties(SearchFilterRequest filter, Long currentUserId) {
        double refLat;
        double refLng;
        String referenceLabel = "Search Center";

        // Determine reference coordinates:
        // Priority 1: Selected College coordinates
        // Priority 2: Passed user coordinates (e.g. Geolocation)
        // Priority 3: First available college as default
        if (filter.getCollegeId() != null) {
            Optional<College> collegeOpt = collegeRepository.findById(filter.getCollegeId());
            if (collegeOpt.isPresent()) {
                refLat = collegeOpt.get().getLatitude();
                refLng = collegeOpt.get().getLongitude();
                referenceLabel = collegeOpt.get().getName();
            } else {
                refLat = 28.5450;
                refLng = 77.1926;
            }
        } else if (filter.getLatitude() != null && filter.getLongitude() != null) {
            refLat = filter.getLatitude();
            refLng = filter.getLongitude();
        } else {
            // Default to first college coordinates
            List<College> colleges = collegeRepository.findAll();
            if (!colleges.isEmpty()) {
                refLat = colleges.get(0).getLatitude();
                refLng = colleges.get(0).getLongitude();
            } else {
                refLat = 28.5450;
                refLng = 77.1926;
            }
        }

        // 5 KM maximum cutoff enforced by backend
        final double maxDistanceCutoff = (filter.getMaxDistance() != null && filter.getMaxDistance() > 0)
                ? filter.getMaxDistance()
                : 5.0;

        // Fetch approved properties with available rooms
        List<Property> approvedProperties = propertyRepository.findAllApprovedAndAvailable();

        List<PropertyResponse> results = new ArrayList<>();

        for (Property prop : approvedProperties) {
            // 1. Calculate Haversine distance
            double distanceKm = haversineService.calculateDistanceKm(
                    refLat, refLng, prop.getLatitude(), prop.getLongitude()
            );

            // 2. Strict distance boundary: must be <= maxDistanceCutoff (default 5.0 KM)
            if (distanceKm > maxDistanceCutoff) {
                continue;
            }

            // Optional minimum distance filter
            if (filter.getMinDistance() != null && distanceKm < filter.getMinDistance()) {
                continue;
            }

            // 3. Rent filters
            if (filter.getMinRent() != null && prop.getMonthlyRent().compareTo(filter.getMinRent()) < 0) {
                continue;
            }
            if (filter.getMaxRent() != null && prop.getMonthlyRent().compareTo(filter.getMaxRent()) > 0) {
                continue;
            }

            // 4. Property type filter
            if (filter.getPropertyType() != null && prop.getPropertyType() != filter.getPropertyType()) {
                continue;
            }

            // 5. Gender preference filter
            if (filter.getGenderPreference() != null && prop.getGenderPreference() != filter.getGenderPreference()) {
                continue;
            }

            // 6. Room sharing filter
            if (filter.getRoomSharingType() != null && prop.getRoomSharingType() != filter.getRoomSharingType()) {
                continue;
            }

            // 7. Amenities filters
            if (Boolean.TRUE.equals(filter.getAc()) && !Boolean.TRUE.equals(prop.getAc())) {
                continue;
            }
            if (Boolean.TRUE.equals(filter.getFoodAvailable()) && !Boolean.TRUE.equals(prop.getFoodAvailable())) {
                continue;
            }
            if (Boolean.TRUE.equals(filter.getWifi()) && !Boolean.TRUE.equals(prop.getWifi())) {
                continue;
            }
            if (Boolean.TRUE.equals(filter.getLaundry()) && !Boolean.TRUE.equals(prop.getLaundry())) {
                continue;
            }
            if (Boolean.TRUE.equals(filter.getParking()) && !Boolean.TRUE.equals(prop.getParking())) {
                continue;
            }

            // Convert to DTO with distance
            PropertyResponse dto = mapToResponse(prop, currentUserId);
            dto.setDistanceKm(distanceKm);
            results.add(dto);
        }

        // Sort results
        String sortBy = filter.getSortBy() != null ? filter.getSortBy().toLowerCase() : "nearest";
        switch (sortBy) {
            case "rent_asc":
                results.sort(Comparator.comparing(PropertyResponse::getMonthlyRent));
                break;
            case "rent_desc":
                results.sort(Comparator.comparing(PropertyResponse::getMonthlyRent).reversed());
                break;
            case "nearest":
            default:
                results.sort(Comparator.comparingDouble(PropertyResponse::getDistanceKm));
                break;
        }

        return results;
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request, User owner) {
        Property property = new Property();
        copyProperties(request, property);
        property.setOwner(owner);
        // By rule: new properties must remain pending until approved by an administrator
        property.setStatus(PropertyStatus.PENDING);

        if (request.getCollegeId() != null) {
            collegeRepository.findById(request.getCollegeId()).ifPresent(property::setCollege);
        }

        Property saved = propertyRepository.save(property);

        // Save images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            boolean isFirst = true;
            for (String imgUrl : request.getImageUrls()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    PropertyImage img = new PropertyImage(imgUrl.trim(), isFirst);
                    img.setProperty(saved);
                    propertyImageRepository.save(img);
                    saved.getImages().add(img);
                    isFirst = false;
                }
            }
        }

        return mapToResponse(saved, owner.getId());
    }

    @Transactional
    public PropertyResponse updateProperty(Long propertyId, PropertyRequest request, Long ownerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        if (!property.getOwner().getId().equals(ownerId)) {
            throw new SecurityException("Unauthorized to modify this property");
        }

        copyProperties(request, property);

        if (request.getCollegeId() != null) {
            collegeRepository.findById(request.getCollegeId()).ifPresent(property::setCollege);
        }

        // Update images if provided
        if (request.getImageUrls() != null) {
            propertyImageRepository.deleteByPropertyId(property.getId());
            property.getImages().clear();

            boolean isFirst = true;
            for (String imgUrl : request.getImageUrls()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    PropertyImage img = new PropertyImage(imgUrl.trim(), isFirst);
                    img.setProperty(property);
                    propertyImageRepository.save(img);
                    property.getImages().add(img);
                    isFirst = false;
                }
            }
        }

        Property updated = propertyRepository.save(property);
        return mapToResponse(updated, ownerId);
    }

    @Transactional
    public void deleteProperty(Long propertyId, Long ownerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        if (!property.getOwner().getId().equals(ownerId)) {
            throw new SecurityException("Unauthorized to delete this property");
        }

        propertyRepository.delete(property);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getOwnerProperties(Long ownerId) {
        return propertyRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(p -> mapToResponse(p, ownerId))
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyResponse updateRoomAvailability(Long propertyId, Integer availableRooms, Long ownerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        if (!property.getOwner().getId().equals(ownerId)) {
            throw new SecurityException("Unauthorized to update room availability for this property");
        }

        property.setAvailableRooms(availableRooms);
        return mapToResponse(propertyRepository.save(property), ownerId);
    }

    // Admin methods
    @Transactional(readOnly = true)
    public List<PropertyResponse> getPendingProperties() {
        return propertyRepository.findAllByStatus(PropertyStatus.PENDING)
                .stream()
                .map(p -> mapToResponse(p, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyResponse approveProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        property.setStatus(PropertyStatus.APPROVED);
        property.setRejectionReason(null);
        Property updated = propertyRepository.save(property);

        // Notify owner
        notificationService.createNotification(
                property.getOwner(),
                "Listing Approved!",
                "Your property \"" + property.getTitle() + "\" has been approved by the admin and is now live for students to discover.",
                "PROPERTY_STATUS",
                property.getId()
        );

        return mapToResponse(updated, null);
    }

    @Transactional
    public PropertyResponse rejectProperty(Long propertyId, String reason) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        property.setStatus(PropertyStatus.REJECTED);
        property.setRejectionReason(reason);
        Property updated = propertyRepository.save(property);

        // Notify owner
        notificationService.createNotification(
                property.getOwner(),
                "Listing Needs Revision",
                "Your property \"" + property.getTitle() + "\" was not approved. Reason: " + reason,
                "PROPERTY_STATUS",
                property.getId()
        );

        return mapToResponse(updated, null);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getAllPropertiesForAdmin() {
        return propertyRepository.findAll()
                .stream()
                .map(p -> mapToResponse(p, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePropertyByAdmin(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        notificationService.createNotification(
                property.getOwner(),
                "Property Listing Removed",
                "Your property listing \"" + property.getTitle() + "\" was removed by administration.",
                "PROPERTY_STATUS",
                null
        );

        propertyRepository.delete(property);
    }

    // Details & Saved Properties
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyDetails(Long propertyId, Double userLat, Double userLng, Long currentUserId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found with id: " + propertyId));

        PropertyResponse response = mapToResponse(property, currentUserId);

        if (userLat != null && userLng != null) {
            double distance = haversineService.calculateDistanceKm(userLat, userLng, property.getLatitude(), property.getLongitude());
            response.setDistanceKm(distance);
        } else if (property.getCollege() != null) {
            double distance = haversineService.calculateDistanceKm(
                    property.getCollege().getLatitude(), property.getCollege().getLongitude(),
                    property.getLatitude(), property.getLongitude()
            );
            response.setDistanceKm(distance);
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getFeaturedProperties(Long currentUserId) {
        return propertyRepository.findAllApprovedAndAvailable().stream()
                .limit(6)
                .map(p -> mapToResponse(p, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleSavedProperty(Long propertyId, User student) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));

        Optional<SavedProperty> savedOpt = savedPropertyRepository.findByStudentIdAndPropertyId(student.getId(), propertyId);
        if (savedOpt.isPresent()) {
            savedPropertyRepository.delete(savedOpt.get());
            return false; // Removed
        } else {
            savedPropertyRepository.save(new SavedProperty(student, property));
            return true; // Added
        }
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getSavedPropertiesForStudent(Long studentId) {
        List<SavedProperty> savedList = savedPropertyRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        return savedList.stream()
                .map(s -> {
                    PropertyResponse res = mapToResponse(s.getProperty(), studentId);
                    res.setSavedByCurrentUser(true);
                    return res;
                })
                .collect(Collectors.toList());
    }

    // Helper mapping
    private PropertyResponse mapToResponse(Property p, Long currentUserId) {
        PropertyResponse res = new PropertyResponse();
        res.setId(p.getId());
        res.setTitle(p.getTitle());
        res.setPropertyType(p.getPropertyType());
        res.setDescription(p.getDescription());
        res.setAddress(p.getAddress());
        res.setCity(p.getCity());
        res.setState(p.getState());
        res.setPinCode(p.getPinCode());
        res.setLatitude(p.getLatitude());
        res.setLongitude(p.getLongitude());
        res.setMonthlyRent(p.getMonthlyRent());
        res.setSecurityDeposit(p.getSecurityDeposit());
        res.setRoomSharingType(p.getRoomSharingType());
        res.setTotalRooms(p.getTotalRooms());
        res.setAvailableRooms(p.getAvailableRooms());
        res.setGenderPreference(p.getGenderPreference());
        res.setFoodAvailable(p.getFoodAvailable());
        res.setFoodDescription(p.getFoodDescription());
        res.setWifi(p.getWifi());
        res.setLaundry(p.getLaundry());
        res.setParking(p.getParking());
        res.setAc(p.getAc());
        res.setContactNumber(p.getContactNumber());
        res.setStatus(p.getStatus());
        res.setRejectionReason(p.getRejectionReason());
        res.setCreatedAt(p.getCreatedAt());

        // Images
        List<String> imageUrls = p.getImages() != null ?
                p.getImages().stream().map(PropertyImage::getImageUrl).collect(Collectors.toList()) :
                new ArrayList<>();
        res.setImageUrls(imageUrls);

        if (!imageUrls.isEmpty()) {
            res.setPrimaryImageUrl(imageUrls.get(0));
        } else {
            res.setPrimaryImageUrl("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80");
        }

        // Owner info
        if (p.getOwner() != null) {
            res.setOwnerId(p.getOwner().getId());
            res.setOwnerName(p.getOwner().getFullName());
            res.setOwnerPhone(p.getOwner().getPhoneNumber());
            res.setOwnerEmail(p.getOwner().getEmail());
        }

        // College info
        if (p.getCollege() != null) {
            res.setCollegeId(p.getCollege().getId());
            res.setCollegeName(p.getCollege().getName());
        }

        // Saved status for user
        if (currentUserId != null) {
            res.setSavedByCurrentUser(savedPropertyRepository.existsByStudentIdAndPropertyId(currentUserId, p.getId()));
        }

        // Reviews
        List<Review> reviews = reviewRepository.findByPropertyIdOrderByCreatedAtDesc(p.getId());
        res.setTotalReviews(reviews.size());
        if (!reviews.isEmpty()) {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            res.setAverageRating(Math.round(avg * 10.0) / 10.0);
        } else {
            res.setAverageRating(4.5); // Default positive rating for showcase
        }

        return res;
    }

    private void copyProperties(PropertyRequest req, Property prop) {
        prop.setTitle(req.getTitle().trim());
        prop.setPropertyType(req.getPropertyType());
        prop.setDescription(req.getDescription().trim());
        prop.setAddress(req.getAddress().trim());
        prop.setCity(req.getCity().trim());
        prop.setState(req.getState().trim());
        prop.setPinCode(req.getPinCode().trim());
        prop.setLatitude(req.getLatitude());
        prop.setLongitude(req.getLongitude());
        prop.setMonthlyRent(req.getMonthlyRent());
        prop.setSecurityDeposit(req.getSecurityDeposit() != null ? req.getSecurityDeposit() : java.math.BigDecimal.ZERO);
        prop.setRoomSharingType(req.getRoomSharingType());
        prop.setTotalRooms(req.getTotalRooms());
        prop.setAvailableRooms(req.getAvailableRooms());
        prop.setGenderPreference(req.getGenderPreference());
        prop.setFoodAvailable(Boolean.TRUE.equals(req.getFoodAvailable()));
        prop.setFoodDescription(req.getFoodDescription());
        prop.setWifi(Boolean.TRUE.equals(req.getWifi()));
        prop.setLaundry(Boolean.TRUE.equals(req.getLaundry()));
        prop.setParking(Boolean.TRUE.equals(req.getParking()));
        prop.setAc(Boolean.TRUE.equals(req.getAc()));
        prop.setContactNumber(req.getContactNumber().trim());
    }
}

