package com.campusstay.service;

import com.campusstay.dto.CollegeWithDistanceDto;
import com.campusstay.entity.College;
import com.campusstay.repository.CollegeRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final HaversineService haversineService;

    public CollegeService(CollegeRepository collegeRepository, HaversineService haversineService) {
        this.collegeRepository = collegeRepository;
        this.haversineService = haversineService;
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public Optional<College> getCollegeById(Long id) {
        return collegeRepository.findById(id);
    }

    public List<College> getCollegesByCity(String city) {
        if (city == null || city.isBlank() || city.equalsIgnoreCase("ALL")) {
            return collegeRepository.findAll();
        }
        return collegeRepository.findByCityIgnoreCase(city.trim());
    }

    public List<College> getCollegesByState(String state) {
        if (state == null || state.isBlank() || state.equalsIgnoreCase("ALL")) {
            return collegeRepository.findAll();
        }
        return collegeRepository.findByStateIgnoreCase(state.trim());
    }

    public List<String> getDistinctCities() {
        return collegeRepository.findDistinctCities();
    }

    public List<String> getDistinctStates() {
        return collegeRepository.findDistinctStates();
    }

    public List<String> getDistricts(String state) {
        if (state == null || state.isBlank() || state.equalsIgnoreCase("ALL")) {
            return collegeRepository.findDistinctDistricts();
        }
        return collegeRepository.findDistrictsByState(state.trim());
    }

    public List<String> getTaluks(String state, String district) {
        if (state == null || state.isBlank() || state.equalsIgnoreCase("ALL") ||
            district == null || district.isBlank() || district.equalsIgnoreCase("ALL")) {
            return List.of();
        }
        return collegeRepository.findTaluksByStateAndDistrict(state.trim(), district.trim());
    }

    /**
     * Builds nested State -> District -> List of Taluks hierarchy
     */
    public Map<String, Map<String, List<String>>> getLocationHierarchy() {
        List<College> all = collegeRepository.findAll();
        Map<String, Map<String, List<String>>> hierarchy = new java.util.TreeMap<>(String.CASE_INSENSITIVE_ORDER);

        for (College c : all) {
            String state = (c.getState() != null && !c.getState().isBlank()) ? c.getState() : "Other";
            String district = (c.getDistrict() != null && !c.getDistrict().isBlank()) ? c.getDistrict() : c.getCity();
            String taluk = (c.getTaluk() != null && !c.getTaluk().isBlank()) ? c.getTaluk() : district;

            hierarchy.putIfAbsent(state, new java.util.TreeMap<>(String.CASE_INSENSITIVE_ORDER));
            Map<String, List<String>> districtMap = hierarchy.get(state);

            districtMap.putIfAbsent(district, new java.util.ArrayList<>());
            List<String> talukList = districtMap.get(district);
            if (!talukList.contains(taluk)) {
                talukList.add(taluk);
            }
        }
        return hierarchy;
    }

    public List<College> filterColleges(String state, String district, String taluk, String city) {
        List<College> all = collegeRepository.findAll();
        return all.stream().filter(c -> {
            if (state != null && !state.isBlank() && !state.equalsIgnoreCase("ALL")) {
                if (!state.equalsIgnoreCase(c.getState())) return false;
            }
            if (district != null && !district.isBlank() && !district.equalsIgnoreCase("ALL")) {
                if (c.getDistrict() != null) {
                    if (!district.equalsIgnoreCase(c.getDistrict()) && !district.equalsIgnoreCase(c.getCity())) return false;
                } else if (!district.equalsIgnoreCase(c.getCity())) {
                    return false;
                }
            }
            if (taluk != null && !taluk.isBlank() && !taluk.equalsIgnoreCase("ALL")) {
                if (c.getTaluk() != null) {
                    if (!taluk.equalsIgnoreCase(c.getTaluk())) return false;
                }
            }
            if (city != null && !city.isBlank() && !city.equalsIgnoreCase("ALL")) {
                if (!city.equalsIgnoreCase(c.getCity())) return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    /**
     * Calculates distance from user's coordinates to all colleges
     * and returns them sorted by ascending distance.
     */
    public List<CollegeWithDistanceDto> getCollegesNearest(double userLat, double userLon) {
        List<College> all = collegeRepository.findAll();
        return all.stream().map(c -> {
            double dist = haversineService.calculateDistanceKm(userLat, userLon, c.getLatitude(), c.getLongitude());
            return new CollegeWithDistanceDto(
                    c.getId(),
                    c.getName(),
                    c.getCode(),
                    c.getCity(),
                    c.getState(),
                    c.getDistrict() != null ? c.getDistrict() : c.getCity(),
                    c.getTaluk() != null ? c.getTaluk() : c.getCity(),
                    c.getLatitude(),
                    c.getLongitude(),
                    c.getAddress(),
                    c.getImageUrl(),
                    dist
            );
        })
        .sorted(Comparator.comparingDouble(CollegeWithDistanceDto::getDistanceKm))
        .collect(Collectors.toList());
    }

    public College saveCollege(College college) {
        return collegeRepository.save(college);
    }
}


