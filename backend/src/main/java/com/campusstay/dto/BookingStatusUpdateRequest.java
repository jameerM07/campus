package com.campusstay.dto;

import com.campusstay.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String ownerNotes;

    public BookingStatusUpdateRequest() {}

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getOwnerNotes() { return ownerNotes; }
    public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }
}

