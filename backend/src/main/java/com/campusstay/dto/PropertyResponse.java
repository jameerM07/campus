package com.campusstay.dto;

import com.campusstay.entity.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PropertyResponse {

    private Long id;
    private String title;
    private PropertyType propertyType;
    private String description;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private Double latitude;
    private Double longitude;
    private BigDecimal monthlyRent;
    private BigDecimal securityDeposit;
    private RoomSharingType roomSharingType;
    private Integer totalRooms;
    private Integer availableRooms;
    private GenderPreference genderPreference;
    private Boolean foodAvailable;
    private String foodDescription;
    private Boolean wifi;
    private Boolean laundry;
    private Boolean parking;
    private Boolean ac;
    private String contactNumber;
    private PropertyStatus status;
    private String rejectionReason;
    private List<String> imageUrls;
    private String primaryImageUrl;
    private Double distanceKm;
    private Boolean savedByCurrentUser = false;

    // Owner summary
    private Long ownerId;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    // College summary
    private Long collegeId;
    private String collegeName;

    private Double averageRating;
    private Integer totalReviews;
    private LocalDateTime createdAt;

    public PropertyResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public BigDecimal getSecurityDeposit() { return securityDeposit; }
    public void setSecurityDeposit(BigDecimal securityDeposit) { this.securityDeposit = securityDeposit; }

    public RoomSharingType getRoomSharingType() { return roomSharingType; }
    public void setRoomSharingType(RoomSharingType roomSharingType) { this.roomSharingType = roomSharingType; }

    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

    public Integer getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(Integer availableRooms) { this.availableRooms = availableRooms; }

    public GenderPreference getGenderPreference() { return genderPreference; }
    public void setGenderPreference(GenderPreference genderPreference) { this.genderPreference = genderPreference; }

    public Boolean getFoodAvailable() { return foodAvailable; }
    public void setFoodAvailable(Boolean foodAvailable) { this.foodAvailable = foodAvailable; }

    public String getFoodDescription() { return foodDescription; }
    public void setFoodDescription(String foodDescription) { this.foodDescription = foodDescription; }

    public Boolean getWifi() { return wifi; }
    public void setWifi(Boolean wifi) { this.wifi = wifi; }

    public Boolean getLaundry() { return laundry; }
    public void setLaundry(Boolean laundry) { this.laundry = laundry; }

    public Boolean getParking() { return parking; }
    public void setParking(Boolean parking) { this.parking = parking; }

    public Boolean getAc() { return ac; }
    public void setAc(Boolean ac) { this.ac = ac; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Boolean getSavedByCurrentUser() { return savedByCurrentUser; }
    public void setSavedByCurrentUser(Boolean savedByCurrentUser) { this.savedByCurrentUser = savedByCurrentUser; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

