package com.campusstay.dto;

public class CollegeWithDistanceDto {
    private Long id;
    private String name;
    private String code;
    private String city;
    private String state;
    private String district;
    private String taluk;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
    private Double distanceKm;

    public CollegeWithDistanceDto() {}

    public CollegeWithDistanceDto(Long id, String name, String code, String city, String state,
                                  String district, String taluk,
                                  Double latitude, Double longitude, String address, String imageUrl,
                                  Double distanceKm) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.city = city;
        this.state = state;
        this.district = district;
        this.taluk = taluk;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.imageUrl = imageUrl;
        this.distanceKm = distanceKm;
    }

    public CollegeWithDistanceDto(Long id, String name, String code, String city, String state,
                                  Double latitude, Double longitude, String address, String imageUrl,
                                  Double distanceKm) {
        this(id, name, code, city, state, city, city, latitude, longitude, address, imageUrl, distanceKm);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getTaluk() {
        return taluk;
    }

    public void setTaluk(String taluk) {
        this.taluk = taluk;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }
}

