import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Map as MapIcon, 
  Grid, 
  ArrowUpDown, 
  Sparkles, 
  RefreshCw, 
  Navigation, 
  ShieldCheck, 
  Check, 
  X,
  Filter,
  RotateCcw,
  Compass
} from 'lucide-react';
import { collegeAPI, propertyAPI, studentAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import PropertyDetailModal from '../components/PropertyDetailModal';
import EmptyState from '../components/EmptyState';
import MapLocationPickerModal from '../components/MapLocationPickerModal';
import { useAuth } from '../context/AuthContext';

const ExploreStaysPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isStudent } = useAuth();

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [exploreState, setExploreState] = useState('ALL');
  const [exploreDistrict, setExploreDistrict] = useState('ALL');
  const [exploreTaluk, setExploreTaluk] = useState('ALL');
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active view toggle: 'split', 'grid', 'map'
  const [viewMode, setViewMode] = useState('split');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailModalProperty, setDetailModalProperty] = useState(null);

  // Filter States
  const [maxDistance, setMaxDistance] = useState(5.0); // Enforced 5 KM default
  const [maxRent, setMaxRent] = useState(25000);
  const [genderPreference, setGenderPreference] = useState('');
  const [roomSharingType, setRoomSharingType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [acOnly, setAcOnly] = useState(false);
  const [foodOnly, setFoodOnly] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [laundryOnly, setLaundryOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearest'); // 'nearest', 'rent_asc', 'rent_desc'

  // Browser Geolocation state
  const [userCoords, setUserCoords] = useState(null);
  const [usingGeolocation, setUsingGeolocation] = useState(false);

  // Load Colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await collegeAPI.getAllColleges();
        if (res.data?.data) {
          const list = res.data.data;
          setColleges(list);

          const paramCollegeId = searchParams.get('collegeId');
          if (paramCollegeId) {
            const found = list.find((c) => c.id.toString() === paramCollegeId);
            if (found) {
              setSelectedCollege(found);
              if (found.state) setExploreState(found.state);
              if (found.district) setExploreDistrict(found.district);
              if (found.taluk) setExploreTaluk(found.taluk);
            } else if (list.length > 0) {
              setSelectedCollege(list[0]);
            }
          } else if (list.length > 0) {
            setSelectedCollege(list[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load colleges:", err);
      }
    };
    fetchColleges();
  }, [searchParams]);

  // Compute available States from colleges
  const exploreStates = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => {
      if (c.state) set.add(c.state);
    });
    return Array.from(set).sort();
  }, [colleges]);

  // Compute available Districts based on selected State
  const exploreDistricts = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => {
      const matchState = exploreState === 'ALL' || c.state?.toLowerCase() === exploreState.toLowerCase();
      if (matchState) {
        const d = c.district || c.city;
        if (d) set.add(d);
      }
    });
    return Array.from(set).sort();
  }, [colleges, exploreState]);

  // Compute available Taluks based on selected State and District
  const exploreTaluks = useMemo(() => {
    const set = new Set();
    colleges.forEach((c) => {
      const matchState = exploreState === 'ALL' || c.state?.toLowerCase() === exploreState.toLowerCase();
      const dist = c.district || c.city;
      const matchDistrict = exploreDistrict === 'ALL' || dist?.toLowerCase() === exploreDistrict.toLowerCase();
      if (matchState && matchDistrict) {
        const t = c.taluk || c.district || c.city;
        if (t) set.add(t);
      }
    });
    return Array.from(set).sort();
  }, [colleges, exploreState, exploreDistrict]);

  // Filtered colleges based on State, District, Taluk
  const filteredExploreColleges = useMemo(() => {
    return colleges.filter((c) => {
      const matchState = exploreState === 'ALL' || c.state?.toLowerCase() === exploreState.toLowerCase();
      const dist = c.district || c.city;
      const matchDistrict = exploreDistrict === 'ALL' || dist?.toLowerCase() === exploreDistrict.toLowerCase();
      const tal = c.taluk || c.district || c.city;
      const matchTaluk = exploreTaluk === 'ALL' || tal?.toLowerCase() === exploreTaluk.toLowerCase();
      return matchState && matchDistrict && matchTaluk;
    });
  }, [colleges, exploreState, exploreDistrict, exploreTaluk]);

  const handleExploreStateChange = (stateVal) => {
    setExploreState(stateVal);
    setExploreDistrict('ALL');
    setExploreTaluk('ALL');
    const matching = colleges.filter((c) => stateVal === 'ALL' || c.state?.toLowerCase() === stateVal.toLowerCase());
    if (matching.length > 0) {
      setSelectedCollege(matching[0]);
      setSearchParams({ collegeId: matching[0].id.toString() });
      setUsingGeolocation(false);
    }
  };

  const handleExploreDistrictChange = (distVal) => {
    setExploreDistrict(distVal);
    setExploreTaluk('ALL');
    const matching = colleges.filter((c) => {
      const matchState = exploreState === 'ALL' || c.state?.toLowerCase() === exploreState.toLowerCase();
      const dist = c.district || c.city;
      const matchDist = distVal === 'ALL' || dist?.toLowerCase() === distVal.toLowerCase();
      return matchState && matchDist;
    });
    if (matching.length > 0) {
      setSelectedCollege(matching[0]);
      setSearchParams({ collegeId: matching[0].id.toString() });
      setUsingGeolocation(false);
    }
  };

  const handleExploreTalukChange = (talukVal) => {
    setExploreTaluk(talukVal);
    const matching = colleges.filter((c) => {
      const matchState = exploreState === 'ALL' || c.state?.toLowerCase() === exploreState.toLowerCase();
      const dist = c.district || c.city;
      const matchDistrict = exploreDistrict === 'ALL' || dist?.toLowerCase() === exploreDistrict.toLowerCase();
      const tal = c.taluk || c.district || c.city;
      const matchTal = talukVal === 'ALL' || tal?.toLowerCase() === talukVal.toLowerCase();
      return matchState && matchDistrict && matchTal;
    });
    if (matching.length > 0) {
      setSelectedCollege(matching[0]);
      setSearchParams({ collegeId: matching[0].id.toString() });
      setUsingGeolocation(false);
    }
  };

  const resetExploreLocation = () => {
    setExploreState('ALL');
    setExploreDistrict('ALL');
    setExploreTaluk('ALL');
    if (colleges.length > 0) {
      setSelectedCollege(colleges[0]);
      setSearchParams({ collegeId: colleges[0].id.toString() });
    }
  };

  const handleMapLocationSelect = (loc) => {
    if (loc.state) setExploreState(loc.state);
    if (loc.district) setExploreDistrict(loc.district);
    if (loc.taluk) setExploreTaluk(loc.taluk);

    if (loc.college) {
      setSelectedCollege(loc.college);
      setSearchParams({ collegeId: loc.college.id.toString() });
      setUsingGeolocation(false);
    } else if (loc.latitude && loc.longitude) {
      // Anchor search to pinned coordinates
      setUserCoords({ latitude: loc.latitude, longitude: loc.longitude });
      setUsingGeolocation(true);
    }
  };

  // Execute 5 KM Accommodation Search whenever filters or selectedCollege change
  useEffect(() => {
    if (!selectedCollege && !userCoords) return;

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        const payload = {
          collegeId: selectedCollege?.id,
          maxDistance: parseFloat(maxDistance) || 5.0, // Strict backend distance cutoff
          maxRent: maxRent ? parseFloat(maxRent) : null,
          genderPreference: genderPreference || null,
          roomSharingType: roomSharingType || null,
          propertyType: propertyType || null,
          ac: acOnly || null,
          foodAvailable: foodOnly || null,
          wifi: wifiOnly || null,
          laundry: laundryOnly || null,
          parking: parkingOnly || null,
          sortBy: sortBy || 'nearest',
        };

        if (usingGeolocation && userCoords) {
          payload.latitude = userCoords.latitude;
          payload.longitude = userCoords.longitude;
        }

        const res = await propertyAPI.searchProperties(payload);
        if (res.data?.data) {
          setProperties(res.data.data);
        }
      } catch (err) {
        console.error("Accommodation search failed:", err);
        setError("Failed to fetch accommodations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [
    selectedCollege,
    maxDistance,
    maxRent,
    genderPreference,
    roomSharingType,
    propertyType,
    acOnly,
    foodOnly,
    wifiOnly,
    laundryOnly,
    parkingOnly,
    sortBy,
    userCoords,
    usingGeolocation,
  ]);

  // Browser Geolocation permission handler
  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setUsingGeolocation(true);
      },
      (err) => {
        console.warn("Location permission denied or unavailable:", err.message);
        // Fallback automatically to selected college coordinates as per specification!
        setUsingGeolocation(false);
        alert("Browser location permission was not granted. Campus Stay will use your selected college coordinates as the anchor point.");
      }
    );
  };

  const handleToggleSaved = async (propertyId) => {
    if (!isStudent) return;
    try {
      const res = await studentAPI.toggleSaveProperty(propertyId);
      const isNowSaved = res.data?.data?.saved;
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, savedByCurrentUser: isNowSaved } : p))
      );
    } catch (err) {
      console.error("Toggle save error:", err);
    }
  };

  const resetFilters = () => {
    setMaxDistance(5.0);
    setMaxRent(25000);
    setGenderPreference('');
    setRoomSharingType('');
    setPropertyType('');
    setAcOnly(false);
    setFoodOnly(false);
    setWifiOnly(false);
    setLaundryOnly(false);
    setParkingOnly(false);
    setSortBy('nearest');
    setUsingGeolocation(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. Header / Campus Anchor Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                5 KM Radius College Accommodation Finder
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Explore Verified Stays
            </h1>
            <p className="text-xs text-slate-500">
              Only admin-approved properties within 5 KM of the selected campus gate are displayed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={requestBrowserLocation}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${
                usingGeolocation
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Use current GPS location"
            >
              <Navigation className="w-4 h-4" />
              <span>{usingGeolocation ? 'Using My GPS' : 'Use My GPS'}</span>
            </button>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-navy-900 text-white font-bold text-xs shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Location Hierarchy Cascading Filter: State -> District -> Taluk -> Campus */}
        <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span>Filter Campus By Location Hierarchy (State &gt; District &gt; Taluk)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMapModalOpen(true)}
                className="text-[11px] text-purple-700 hover:text-purple-800 font-extrabold flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 px-2.5 py-1 rounded-xl transition-all shadow-xs"
                title="Pin exact location on interactive map to auto-detect State, District, and Taluk"
              >
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                <span>🗺️ Pin on Map</span>
              </button>
              {(exploreState !== 'ALL' || exploreDistrict !== 'ALL' || exploreTaluk !== 'ALL') && (
                <button
                  type="button"
                  onClick={resetExploreLocation}
                  className="text-[11px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Location</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* State */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-purple-500">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                1. State
              </label>
              <select
                value={exploreState}
                onChange={(e) => handleExploreStateChange(e.target.value)}
                className="w-full bg-transparent font-bold text-navy-900 text-xs focus:outline-none cursor-pointer py-0.5"
              >
                <option value="ALL">All States ({exploreStates.length})</option>
                {exploreStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-purple-500">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                2. District
              </label>
              <select
                value={exploreDistrict}
                onChange={(e) => handleExploreDistrictChange(e.target.value)}
                className="w-full bg-transparent font-bold text-navy-900 text-xs focus:outline-none cursor-pointer py-0.5"
              >
                <option value="ALL">All Districts ({exploreDistricts.length})</option>
                {exploreDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Taluk */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-purple-500">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                3. Taluk
              </label>
              <select
                value={exploreTaluk}
                onChange={(e) => handleExploreTalukChange(e.target.value)}
                className="w-full bg-transparent font-bold text-navy-900 text-xs focus:outline-none cursor-pointer py-0.5"
              >
                <option value="ALL">All Taluks ({exploreTaluks.length})</option>
                {exploreTaluks.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Campus */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-300 ring-2 ring-purple-600/10 focus-within:border-purple-500">
              <label className="block text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                College Campus ({filteredExploreColleges.length})
              </label>
              <select
                value={selectedCollege?.id || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  const found = colleges.find((c) => c.id.toString() === id);
                  if (found) {
                    setSelectedCollege(found);
                    setSearchParams({ collegeId: id });
                    setUsingGeolocation(false);
                  }
                }}
                className="w-full bg-transparent font-bold text-navy-900 text-xs focus:outline-none cursor-pointer truncate py-0.5"
              >
                {filteredExploreColleges.length === 0 ? (
                  <option value="">No college matches</option>
                ) : (
                  filteredExploreColleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.taluk || c.district || c.city}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls Bar: View Toggle & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Found <strong className="text-navy-900 font-extrabold">{properties.length} verified stays</strong> within 5 KM of {selectedCollege?.code || 'campus'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 font-bold text-navy-900 text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="nearest">Nearest First (Distance)</option>
              <option value="rent_asc">Lowest Rent</option>
              <option value="rent_desc">Highest Rent</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'split' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Body: Sidebar Filters + Property Feed / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <aside className={`lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-6 ${
          mobileFilterOpen ? 'block fixed inset-4 z-50 overflow-y-auto' : 'hidden lg:block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <h3 className="font-extrabold text-sm text-navy-900">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-700"
              >
                Reset
              </button>
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Maximum Distance Slider (Strict 5 KM limit) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-700">Max Radius</span>
              <span className="text-purple-600 font-extrabold">{maxDistance} KM</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.5 km</span>
              <span>2.5 km</span>
              <span>5.0 km (Max)</span>
            </div>
          </div>

          {/* Max Rent Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-700">Max Monthly Rent</span>
              <span className="text-navy-900 font-extrabold">₹{maxRent.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="4000"
              max="25000"
              step="1000"
              value={maxRent}
              onChange={(e) => setMaxRent(parseInt(e.target.value))}
              className="w-full accent-navy-900 cursor-pointer"
            />
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Gender Preference</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              {['', 'BOYS', 'GIRLS', 'CO_ED'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderPreference(g)}
                  className={`py-2 rounded-xl text-[11px] border transition-all ${
                    genderPreference === g
                      ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g === '' ? 'Any' : g === 'BOYS' ? 'Boys' : g === 'GIRLS' ? 'Girls' : 'Co-ed'}
                </button>
              ))}
            </div>
          </div>

          {/* Room Sharing Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Room Sharing</label>
            <select
              value={roomSharingType}
              onChange={(e) => setRoomSharingType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="">All Sharing Types</option>
              <option value="SINGLE">Single Room</option>
              <option value="DOUBLE">Double Sharing</option>
              <option value="TRIPLE">Triple Sharing</option>
              <option value="FOUR_PLUS">4+ Sharing</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="">All Accommodation Types</option>
              <option value="HOSTEL">Hostel</option>
              <option value="PG">PG Stay</option>
              <option value="RENTAL_ROOM">Rental Room</option>
              <option value="APARTMENT">Shared Apartment</option>
            </select>
          </div>

          {/* Amenities Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-700 mb-2">Required Amenities</span>
            
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={foodOnly}
                onChange={(e) => setFoodOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span>Food / Mess Included</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={wifiOnly}
                onChange={(e) => setWifiOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span>High-Speed Wi-Fi</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={acOnly}
                onChange={(e) => setAcOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span>Air Conditioned (AC)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={laundryOnly}
                onChange={(e) => setLaundryOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span>Laundry Service</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={parkingOnly}
                onChange={(e) => setParkingOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span>Vehicle Parking</span>
            </label>
          </div>

          {mobileFilterOpen && (
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-2xl text-xs shadow-md mt-4"
            >
              Apply Filters ({properties.length} Results)
            </button>
          )}
        </aside>

        {/* Content View: Split, Cards or Map */}
        <main className={`${viewMode === 'map' ? 'lg:col-span-9' : 'lg:col-span-9'} space-y-6`}>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-white rounded-3xl border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              title="No Accommodations Found Within 5 KM"
              description="We could not find any stays satisfying all your selected filters within 5 KM of this college. Try expanding your rent budget or resetting some amenity filters."
              actionButton={
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm hover:bg-purple-700 transition-colors"
                >
                  Reset All Filters
                </button>
              }
            />
          ) : viewMode === 'split' ? (
            /* Split View: Map sticky on top/side + 2-col property cards */
            <div className="space-y-6">
              <div className="h-[420px] w-full">
                <PropertyMap
                  college={selectedCollege}
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={(p) => setDetailModalProperty(p)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onSelect={(p) => setDetailModalProperty(p)}
                    onToggleSaved={handleToggleSaved}
                  />
                ))}
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={(p) => setDetailModalProperty(p)}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          ) : (
            /* Map View */
            <div className="h-[750px] w-full">
              <PropertyMap
                college={selectedCollege}
                properties={properties}
                selectedProperty={selectedProperty}
                onSelectProperty={(p) => setDetailModalProperty(p)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Property Details Modal */}
      {detailModalProperty && (
        <PropertyDetailModal
          property={detailModalProperty}
          onClose={() => setDetailModalProperty(null)}
        />
      )}

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setMapModalOpen(false)}
        colleges={colleges}
        initialCollege={selectedCollege}
        onSelectLocation={handleMapLocationSelect}
      />
    </div>
  );
};

export default ExploreStaysPage;

