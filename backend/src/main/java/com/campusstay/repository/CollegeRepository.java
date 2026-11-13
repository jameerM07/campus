package com.campusstay.repository;

import com.campusstay.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByCode(String code);

    List<College> findByCityIgnoreCase(String city);

    List<College> findByStateIgnoreCase(String state);

    List<College> findByDistrictIgnoreCase(String district);

    List<College> findByTalukIgnoreCase(String taluk);

    List<College> findByStateIgnoreCaseAndDistrictIgnoreCase(String state, String district);

    List<College> findByStateIgnoreCaseAndDistrictIgnoreCaseAndTalukIgnoreCase(String state, String district, String taluk);

    @Query("SELECT DISTINCT c.city FROM College c ORDER BY c.city ASC")
    List<String> findDistinctCities();

    @Query("SELECT DISTINCT c.state FROM College c ORDER BY c.state ASC")
    List<String> findDistinctStates();

    @Query("SELECT DISTINCT c.district FROM College c WHERE c.district IS NOT NULL ORDER BY c.district ASC")
    List<String> findDistinctDistricts();

    @Query("SELECT DISTINCT c.district FROM College c WHERE c.district IS NOT NULL AND LOWER(c.state) = LOWER(:state) ORDER BY c.district ASC")
    List<String> findDistrictsByState(@Param("state") String state);

    @Query("SELECT DISTINCT c.taluk FROM College c WHERE c.taluk IS NOT NULL AND LOWER(c.state) = LOWER(:state) AND LOWER(c.district) = LOWER(:district) ORDER BY c.taluk ASC")
    List<String> findTaluksByStateAndDistrict(@Param("state") String state, @Param("district") String district);
}

