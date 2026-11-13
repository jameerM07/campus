package com.campusstay.dto;

import com.campusstay.entity.GenderPreference;
import com.campusstay.entity.PropertyType;
import com.campusstay.entity.RoomSharingType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class PropertyRequest {

    @NotBlank(message = "Property name is required")
    private String title;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Full address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "PIN code is required")
    private String pinCode;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Monthly rent is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly rent must be greater than 0")
    private BigDecimal monthlyRent;

    private BigDecimal securityDeposit = BigDecimal.ZERO;

    @NotNull(message = "Room sharing type is required")
    private RoomSharingType roomSharingType;

    @NotNull(message = "Total rooms is required")
    @Min(value = 1, message = "Must have at least 1 room")
    private Integer totalRooms;

    @NotNull(message = "Available rooms is required")
    @Min(value = 0, message = "Available rooms cannot be negative")
    private Integer availableRooms;

    @NotNull(message = "Gender preference is required")
    private GenderPreference genderPreference;

    private Boolean foodAvailable = false;
    private String foodDescription;
    private Boolean wifi = false;
    private Boolean laundry = false;
    private Boolean parking = false;
    private Boolean ac = false;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    private Long collegeId;
    private List<String> imageUrls;

    public PropertyRequest() {}

    // Getters and Setters
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

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}

