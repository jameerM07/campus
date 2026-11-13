package com.campusstay.dto;

import com.campusstay.entity.GenderPreference;
import com.campusstay.entity.PropertyType;
import com.campusstay.entity.RoomSharingType;
import java.math.BigDecimal;

public class SearchFilterRequest {

    private Long collegeId;
    private Double latitude;
    private Double longitude;
    private Double minDistance;
    private Double maxDistance = 5.0; // Default 5 KM as per core requirement
    private BigDecimal minRent;
    private BigDecimal maxRent;
    private PropertyType propertyType;
    private RoomSharingType roomSharingType;
    private GenderPreference genderPreference;
    private Boolean foodAvailable;
    private Boolean wifi;
    private Boolean laundry;
    private Boolean parking;
    private Boolean ac;
    private String sortBy = "nearest"; // "nearest", "rent_asc", "rent_desc"

    public SearchFilterRequest() {}

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getMinDistance() { return minDistance; }
    public void setMinDistance(Double minDistance) { this.minDistance = minDistance; }

    public Double getMaxDistance() { return maxDistance; }
    public void setMaxDistance(Double maxDistance) { this.maxDistance = maxDistance; }

    public BigDecimal getMinRent() { return minRent; }
    public void setMinRent(BigDecimal minRent) { this.minRent = minRent; }

    public BigDecimal getMaxRent() { return maxRent; }
    public void setMaxRent(BigDecimal maxRent) { this.maxRent = maxRent; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public RoomSharingType getRoomSharingType() { return roomSharingType; }
    public void setRoomSharingType(RoomSharingType roomSharingType) { this.roomSharingType = roomSharingType; }

    public GenderPreference getGenderPreference() { return genderPreference; }
    public void setGenderPreference(GenderPreference genderPreference) { this.genderPreference = genderPreference; }

    public Boolean getFoodAvailable() { return foodAvailable; }
    public void setFoodAvailable(Boolean foodAvailable) { this.foodAvailable = foodAvailable; }

    public Boolean getWifi() { return wifi; }
    public void setWifi(Boolean wifi) { this.wifi = wifi; }

    public Boolean getLaundry() { return laundry; }
    public void setLaundry(Boolean laundry) { this.laundry = laundry; }

    public Boolean getParking() { return parking; }
    public void setParking(Boolean parking) { this.parking = parking; }

    public Boolean getAc() { return ac; }
    public void setAc(Boolean ac) { this.ac = ac; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
}

