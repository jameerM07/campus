package com.campusstay.dto;

import java.util.List;
import java.util.Map;

public class LocationHierarchyDto {
    private Map<String, Map<String, List<String>>> hierarchy;

    public LocationHierarchyDto() {}

    public LocationHierarchyDto(Map<String, Map<String, List<String>>> hierarchy) {
        this.hierarchy = hierarchy;
    }

    public Map<String, Map<String, List<String>>> getHierarchy() {
        return hierarchy;
    }

    public void setHierarchy(Map<String, Map<String, List<String>>> hierarchy) {
        this.hierarchy = hierarchy;
    }
}

