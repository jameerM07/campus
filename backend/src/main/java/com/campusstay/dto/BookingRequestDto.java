package com.campusstay.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequestDto {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Expected move-in date is required")
    private LocalDate expectedMoveInDate;

    private String message;

    public BookingRequestDto() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public LocalDate getExpectedMoveInDate() { return expectedMoveInDate; }
    public void setExpectedMoveInDate(LocalDate expectedMoveInDate) { this.expectedMoveInDate = expectedMoveInDate; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

