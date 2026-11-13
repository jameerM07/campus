package com.campusstay.controller;

import com.campusstay.dto.ApiResponse;
import com.campusstay.dto.CollegeWithDistanceDto;
import com.campusstay.entity.College;
import com.campusstay.service.CollegeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<College>>> getAllColleges(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String taluk,
            @RequestParam(required = false) String city) {
        if ((state != null && !state.isBlank()) ||
            (district != null && !district.isBlank()) ||
            (taluk != null && !taluk.isBlank()) ||
            (city != null && !city.isBlank())) {
            return ResponseEntity.ok(ApiResponse.ok(collegeService.filterColleges(state, district, taluk, city)));
        }
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getAllColleges()));
    }

    @GetMapping("/hierarchy")
    public ResponseEntity<ApiResponse<Map<String, Map<String, List<String>>>>> getLocationHierarchy() {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getLocationHierarchy()));
    }

    @GetMapping("/states")
    public ResponseEntity<ApiResponse<List<String>>> getDistinctStates() {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getDistinctStates()));
    }

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<String>>> getDistricts(@RequestParam(required = false) String state) {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getDistricts(state)));
    }

    @GetMapping("/taluks")
    public ResponseEntity<ApiResponse<List<String>>> getTaluks(
            @RequestParam String state,
            @RequestParam String district) {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getTaluks(state, district)));
    }

    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<String>>> getDistinctCities() {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getDistinctCities()));
    }

    @GetMapping("/by-city")
    public ResponseEntity<ApiResponse<List<College>>> getCollegesByCity(@RequestParam String city) {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getCollegesByCity(city)));
    }

    @GetMapping("/nearest")
    public ResponseEntity<ApiResponse<List<CollegeWithDistanceDto>>> getCollegesNearest(
            @RequestParam double lat,
            @RequestParam double lon) {
        return ResponseEntity.ok(ApiResponse.ok(collegeService.getCollegesNearest(lat, lon)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<College>> getCollegeById(@PathVariable Long id) {
        return collegeService.getCollegeById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.ok(c)))
                .orElse(ResponseEntity.notFound().build());
    }
}

