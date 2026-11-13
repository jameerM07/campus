package com.campusstay.dto;

import com.campusstay.entity.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponseDto {

    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyAddress;
    private BigDecimal monthlyRent;
    private String propertyImageUrl;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String collegeName;
    private String course;
    private String yearOfStudy;

    private LocalDate expectedMoveInDate;
    private String message;
    private BookingStatus status;
    private String ownerNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookingResponseDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public String getPropertyImageUrl() { return propertyImageUrl; }
    public void setPropertyImageUrl(String propertyImageUrl) { this.propertyImageUrl = propertyImageUrl; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public LocalDate getExpectedMoveInDate() { return expectedMoveInDate; }
    public void setExpectedMoveInDate(LocalDate expectedMoveInDate) { this.expectedMoveInDate = expectedMoveInDate; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getOwnerNotes() { return ownerNotes; }
    public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

