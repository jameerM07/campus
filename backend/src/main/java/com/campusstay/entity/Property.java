package com.campusstay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    private College college;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false, length = 30)
    private PropertyType propertyType;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String city;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String state;

    @NotBlank
    @Column(name = "pin_code", nullable = false, length = 20)
    private String pinCode;

    @NotNull
    @Column(nullable = false)
    private Double latitude;

    @NotNull
    @Column(nullable = false)
    private Double longitude;

    @NotNull
    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "security_deposit", precision = 10, scale = 2)
    private BigDecimal securityDeposit = BigDecimal.ZERO;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "room_sharing_type", nullable = false, length = 20)
    private RoomSharingType roomSharingType;

    @Column(name = "total_rooms", nullable = false)
    private Integer totalRooms = 1;

    @Column(name = "available_rooms", nullable = false)
    private Integer availableRooms = 1;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender_preference", nullable = false, length = 20)
    private GenderPreference genderPreference;

    @Column(name = "food_available", nullable = false)
    private Boolean foodAvailable = false;

    @Column(name = "food_description", length = 255)
    private String foodDescription;

    @Column(nullable = false)
    private Boolean wifi = false;

    @Column(nullable = false)
    private Boolean laundry = false;

    @Column(nullable = false)
    private Boolean parking = false;

    @Column(nullable = false)
    private Boolean ac = false;

    @NotBlank
    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PropertyStatus status = PropertyStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<PropertyImage> images = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Property() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to add images
    public void addImage(PropertyImage image) {
        images.add(image);
        image.setProperty(this);
    }

    public void removeImage(PropertyImage image) {
        images.remove(image);
        image.setProperty(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }

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

    public List<PropertyImage> getImages() { return images; }
    public void setImages(List<PropertyImage> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
