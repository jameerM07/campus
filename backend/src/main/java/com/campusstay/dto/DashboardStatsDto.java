package com.campusstay.dto;

public class DashboardStatsDto {

    // Admin stats
    private Long totalStudents;
    private Long totalOwners;
    private Long totalProperties;
    private Long approvedProperties;
    private Long pendingProperties;
    private Long rejectedProperties;
    private Long totalBookings;
    private Long pendingBookings;
    private Long acceptedBookings;

    // Owner specific stats
    private Long myPropertiesCount;
    private Long myApprovedCount;
    private Long myPendingCount;
    private Integer myAvailableRooms;
    private Long myTotalBookingsCount;
    private Long myPendingBookingsCount;

    // Student specific stats
    private Long savedPropertiesCount;
    private Long activeBookingsCount;

    public DashboardStatsDto() {}

    // Getters and Setters
    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getTotalOwners() { return totalOwners; }
    public void setTotalOwners(Long totalOwners) { this.totalOwners = totalOwners; }

    public Long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(Long totalProperties) { this.totalProperties = totalProperties; }

    public Long getApprovedProperties() { return approvedProperties; }
    public void setApprovedProperties(Long approvedProperties) { this.approvedProperties = approvedProperties; }

    public Long getPendingProperties() { return pendingProperties; }
    public void setPendingProperties(Long pendingProperties) { this.pendingProperties = pendingProperties; }

    public Long getRejectedProperties() { return rejectedProperties; }
    public void setRejectedProperties(Long rejectedProperties) { this.rejectedProperties = rejectedProperties; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(Long pendingBookings) { this.pendingBookings = pendingBookings; }

    public Long getAcceptedBookings() { return acceptedBookings; }
    public void setAcceptedBookings(Long acceptedBookings) { this.acceptedBookings = acceptedBookings; }

    public Long getMyPropertiesCount() { return myPropertiesCount; }
    public void setMyPropertiesCount(Long myPropertiesCount) { this.myPropertiesCount = myPropertiesCount; }

    public Long getMyApprovedCount() { return myApprovedCount; }
    public void setMyApprovedCount(Long myApprovedCount) { this.myApprovedCount = myApprovedCount; }

    public Long getMyPendingCount() { return myPendingCount; }
    public void setMyPendingCount(Long myPendingCount) { this.myPendingCount = myPendingCount; }

    public Integer getMyAvailableRooms() { return myAvailableRooms; }
    public void setMyAvailableRooms(Integer myAvailableRooms) { this.myAvailableRooms = myAvailableRooms; }

    public Long getMyTotalBookingsCount() { return myTotalBookingsCount; }
    public void setMyTotalBookingsCount(Long myTotalBookingsCount) { this.myTotalBookingsCount = myTotalBookingsCount; }

    public Long getMyPendingBookingsCount() { return myPendingBookingsCount; }
    public void setMyPendingBookingsCount(Long myPendingBookingsCount) { this.myPendingBookingsCount = myPendingBookingsCount; }

    public Long getSavedPropertiesCount() { return savedPropertiesCount; }
    public void setSavedPropertiesCount(Long savedPropertiesCount) { this.savedPropertiesCount = savedPropertiesCount; }

    public Long getActiveBookingsCount() { return activeBookingsCount; }
    public void setActiveBookingsCount(Long activeBookingsCount) { this.activeBookingsCount = activeBookingsCount; }
}

