import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Search, CheckCircle2, Building2, ChevronDown, RotateCcw } from 'lucide-react';
import { collegeAPI } from '../services/api';
import MapLocationPickerModal from './MapLocationPickerModal';

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

const LocationBasedCollegeSelect = ({
  value,
  onChange,
  onCollegeSelect,
  label = "Select College / University *",
  helperText,
  required = true,
  name = "collegeName",
}) => {
  const [colleges, setColleges] = useState([]);
  const [collegesWithDistance, setCollegesWithDistance] = useState([]);
  
  // Location Hierarchy Filters
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedTaluk, setSelectedTaluk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // GPS Detection state
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState(null);
  const [isMapModalOpen, setMapModalOpen] = useState(false);

  const handleMapLocationSelect = (loc) => {
    if (loc.state) setSelectedState(loc.state);
    if (loc.district) setSelectedDistrict(loc.district);
    if (loc.taluk) setSelectedTaluk(loc.taluk);

    if (loc.college) {
      onChange({ target: { name, value: loc.college.name } });
      if (onCollegeSelect) onCollegeSelect(loc.college);
      setGpsMessage({
        type: 'success',
        text: `📍 Pinned Nearest: ${loc.college.name} in ${loc.taluk || loc.district}, ${loc.state}!`,
      });
    } else {
      setGpsMessage({
        type: 'success',
        text: `📍 Location Pinned: ${loc.taluk || loc.district}, ${loc.state}!`,
      });
    }
  };

  useEffect(() => {
    collegeAPI.getAllColleges()
      .then((res) => {
        const list = res.data?.data || [];
        setColleges(list);
        setCollegesWithDistance(list);

        // If no initial value, select the first college
        if (!value && list.length > 0) {
          const first = list[0];
          onChange({ target: { name, value: first.name } });
          if (onCollegeSelect) onCollegeSelect(first);
        }
      })
      .catch((err) => console.error("Failed to load colleges:", err));
  }, []);

  // Compute available States from colleges
  const states = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => {
      if (c.state) set.add(c.state);
    });
    return Array.from(set).sort();
  }, [colleges]);

  // Compute available Districts based on selected State
  const districts = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      if (matchState && (c.district || c.city)) {
        set.add(c.district || c.city);
      }
    });
    return Array.from(set).sort();
  }, [colleges, selectedState]);

  // Compute available Taluks based on selected State and District
  const taluks = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDistrict = selectedDistrict === 'ALL' || dist?.toLowerCase() === selectedDistrict.toLowerCase();
      if (matchState && matchDistrict && (c.taluk || c.district || c.city)) {
        set.add(c.taluk || c.district || c.city);
      }
    });
    return Array.from(set).sort();
  }, [colleges, selectedState, selectedDistrict]);

  // Handle GPS detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;

        const enriched = colleges.map((c) => {
          const dist = calculateDistanceKm(userLat, userLon, c.latitude, c.longitude);
          return { ...c, distanceKm: dist };
        }).sort((a, b) => a.distanceKm - b.distanceKm);

        setCollegesWithDistance(enriched);
        setDetectingGps(false);

        if (enriched.length > 0) {
          const nearest = enriched[0];
          // Auto-select nearest college
          onChange({ target: { name, value: nearest.name } });
          if (onCollegeSelect) onCollegeSelect(nearest);

          // Auto-fill State, District, and Taluk
          if (nearest.state) setSelectedState(nearest.state);
          if (nearest.district) setSelectedDistrict(nearest.district);
          if (nearest.taluk) setSelectedTaluk(nearest.taluk);

          setGpsMessage({
            type: 'success',
            text: `📍 Nearest: ${nearest.name} (~${nearest.distanceKm} km away) in ${nearest.taluk || nearest.district}, ${nearest.state}!`,
          });
        }
      },
      (err) => {
        setDetectingGps(false);
        console.warn("GPS error:", err);
        setGpsMessage({
          type: 'error',
          text: 'Location permission denied. Please select your State, District, and Taluk manually below.',
        });
      },
      { timeout: 8000 }
    );
  };

  // Filter colleges based on State, District, Taluk, and search text
  const filteredColleges = useMemo(() => {
    return collegesWithDistance.filter((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDistrict = selectedDistrict === 'ALL' || dist?.toLowerCase() === selectedDistrict.toLowerCase();
      const tal = c.taluk || c.district || c.city;
      const matchTaluk = selectedTaluk === 'ALL' || tal?.toLowerCase() === selectedTaluk.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.district && c.district.toLowerCase().includes(q)) ||
        (c.taluk && c.taluk.toLowerCase().includes(q)) ||
        (c.state && c.state.toLowerCase().includes(q));

      return matchState && matchDistrict && matchTaluk && matchQuery;
    });
  }, [collegesWithDistance, selectedState, selectedDistrict, selectedTaluk, searchQuery]);

  // When filters change, ensure selected college value is updated if current isn't in filtered list
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setSelectedDistrict('ALL');
    setSelectedTaluk('ALL');

    const matching = collegesWithDistance.filter((c) =>
      newState === 'ALL' || c.state?.toLowerCase() === newState.toLowerCase()
    );
    if (matching.length > 0 && !matching.some((c) => c.name === value)) {
      onChange({ target: { name, value: matching[0].name } });
      if (onCollegeSelect) onCollegeSelect(matching[0]);
    }
  };

  const handleDistrictChange = (newDistrict) => {
    setSelectedDistrict(newDistrict);
    setSelectedTaluk('ALL');

    const matching = collegesWithDistance.filter((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDist = newDistrict === 'ALL' || dist?.toLowerCase() === newDistrict.toLowerCase();
      return matchState && matchDist;
    });
    if (matching.length > 0 && !matching.some((c) => c.name === value)) {
      onChange({ target: { name, value: matching[0].name } });
      if (onCollegeSelect) onCollegeSelect(matching[0]);
    }
  };

  const handleTalukChange = (newTaluk) => {
    setSelectedTaluk(newTaluk);

    const matching = collegesWithDistance.filter((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDist = selectedDistrict === 'ALL' || dist?.toLowerCase() === selectedDistrict.toLowerCase();
      const tal = c.taluk || c.district || c.city;
      const matchTal = newTaluk === 'ALL' || tal?.toLowerCase() === newTaluk.toLowerCase();
      return matchState && matchDist && matchTal;
    });
    if (matching.length > 0 && !matching.some((c) => c.name === value)) {
      onChange({ target: { name, value: matching[0].name } });
      if (onCollegeSelect) onCollegeSelect(matching[0]);
    }
  };

  const resetHierarchy = () => {
    setSelectedState('ALL');
    setSelectedDistrict('ALL');
    setSelectedTaluk('ALL');
    setSearchQuery('');
  };

  const handleSelectChange = (e) => {
    const selectedName = e.target.value;
    onChange(e);
    if (onCollegeSelect) {
      const match = colleges.find((c) => c.name === selectedName);
      if (match) onCollegeSelect(match);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and GPS Detection Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMapModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition-all shadow-xs"
            title="Click or pin exact location on interactive map to auto-detect State, District, and Taluk"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>🗺️ Pin on Map</span>
          </button>

          {(selectedState !== 'ALL' || selectedDistrict !== 'ALL' || selectedTaluk !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={resetHierarchy}
              className="text-[11px] text-slate-500 hover:text-purple-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={detectingGps}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition-all shadow-xs"
          >
            <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : 'text-purple-600'}`} />
            <span>{detectingGps ? 'Locating...' : '📍 Auto-Detect Nearest (GPS)'}</span>
          </button>
        </div>
      </div>

      {/* GPS Feedback Message */}
      {gpsMessage && (
        <div
          className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            gpsMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}
        >
          {gpsMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="flex-1">{gpsMessage.text}</span>
          <button
            type="button"
            onClick={() => setGpsMessage(null)}
            className="text-xs text-slate-400 hover:text-slate-600 ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Cascading Location Hierarchy: State -> District -> Taluk */}
      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-purple-600" />
          <span>Filter by Location Hierarchy (State &gt; District &gt; Taluk)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* 1. STATE SELECTOR */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              1. Select State
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-xs truncate"
              >
                <option value="ALL">All States ({states.length})</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. DISTRICT SELECTOR */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              2. Select District
            </label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-xs truncate"
              >
                <option value="ALL">
                  {selectedState === 'ALL' ? `All Districts (${districts.length})` : `All in ${selectedState} (${districts.length})`}
                </option>
                {districts.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. TALUK / SUB-DISTRICT SELECTOR */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              3. Select Taluk / Area
            </label>
            <div className="relative">
              <select
                value={selectedTaluk}
                onChange={(e) => handleTalukChange(e.target.value)}
                className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-xs truncate"
              >
                <option value="ALL">
                  {selectedDistrict === 'ALL' ? `All Taluks (${taluks.length})` : `All in ${selectedDistrict} (${taluks.length})`}
                </option>
                {taluks.map((tlk) => (
                  <option key={tlk} value={tlk}>
                    {tlk}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative pt-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Or type college name, short code, or city to search directly..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Main College Dropdown */}
      <div className="relative">
        <Building2 className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          name={name}
          value={value}
          onChange={handleSelectChange}
          required={required}
          className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-xs"
        >
          {filteredColleges.length === 0 ? (
            <option value="" disabled>
              No colleges found for selected location. Try clicking "Reset" above.
            </option>
          ) : (
            filteredColleges.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} — {c.taluk || c.district || c.city}, {c.state} {c.distanceKm !== undefined ? `(~${c.distanceKm} km away)` : ''}
              </option>
            ))
          )}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Location Badge info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          Showing <strong className="text-purple-700 font-bold">{filteredColleges.length}</strong> college(s)
          {selectedState !== 'ALL' && ` in ${selectedState}`}
          {selectedDistrict !== 'ALL' && ` › ${selectedDistrict}`}
          {selectedTaluk !== 'ALL' && ` › ${selectedTaluk}`}
        </span>
        {helperText && <span>{helperText}</span>}
      </div>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setMapModalOpen(false)}
        colleges={colleges}
        initialCollege={colleges.find((c) => c.name === value)}
        onSelectLocation={handleMapLocationSelect}
      />
    </div>
  );
};

export default LocationBasedCollegeSelect;
