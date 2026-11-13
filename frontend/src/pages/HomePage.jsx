import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Compass, 
  Star, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BedDouble, 
  Wifi, 
  Utensils,
  Navigation,
  RotateCcw
} from 'lucide-react';
import { collegeAPI, propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import MapLocationPickerModal from '../components/MapLocationPickerModal';

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
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

const HomePage = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedTaluk, setSelectedTaluk] = useState('ALL');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalProperty, setActiveModalProperty] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState(null);
  const [isMapModalOpen, setMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesRes, propsRes] = await Promise.all([
          collegeAPI.getAllColleges(),
          propertyAPI.getFeaturedProperties(),
        ]);
        if (collegesRes.data?.data) {
          const list = collegesRes.data.data;
          setColleges(list);
          if (list.length > 0) {
            setSelectedCollegeId(list[0].id.toString());
          }
        }
        if (propsRes.data?.data) {
          setFeaturedProperties(propsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      if (matchState) {
        const d = c.district || c.city;
        if (d) set.add(d);
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
      if (matchState && matchDistrict) {
        const t = c.taluk || c.district || c.city;
        if (t) set.add(t);
      }
    });
    return Array.from(set).sort();
  }, [colleges, selectedState, selectedDistrict]);

  // Filtered colleges based on State, District, Taluk
  const filteredColleges = useMemo(() => {
    return colleges.filter((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDistrict = selectedDistrict === 'ALL' || dist?.toLowerCase() === selectedDistrict.toLowerCase();
      const tal = c.taluk || c.district || c.city;
      const matchTaluk = selectedTaluk === 'ALL' || tal?.toLowerCase() === selectedTaluk.toLowerCase();
      return matchState && matchDistrict && matchTaluk;
    });
  }, [colleges, selectedState, selectedDistrict, selectedTaluk]);

  // Handle State change
  const handleStateChange = (stateVal) => {
    setSelectedState(stateVal);
    setSelectedDistrict('ALL');
    setSelectedTaluk('ALL');
    const matching = colleges.filter((c) => stateVal === 'ALL' || c.state?.toLowerCase() === stateVal.toLowerCase());
    if (matching.length > 0) {
      setSelectedCollegeId(matching[0].id.toString());
    }
  };

  // Handle District change
  const handleDistrictChange = (distVal) => {
    setSelectedDistrict(distVal);
    setSelectedTaluk('ALL');
    const matching = colleges.filter((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDist = distVal === 'ALL' || dist?.toLowerCase() === distVal.toLowerCase();
      return matchState && matchDist;
    });
    if (matching.length > 0) {
      setSelectedCollegeId(matching[0].id.toString());
    }
  };

  // Handle Taluk change
  const handleTalukChange = (talukVal) => {
    setSelectedTaluk(talukVal);
    const matching = colleges.filter((c) => {
      const matchState = selectedState === 'ALL' || c.state?.toLowerCase() === selectedState.toLowerCase();
      const dist = c.district || c.city;
      const matchDist = selectedDistrict === 'ALL' || dist?.toLowerCase() === selectedDistrict.toLowerCase();
      const tal = c.taluk || c.district || c.city;
      const matchTal = talukVal === 'ALL' || tal?.toLowerCase() === talukVal.toLowerCase();
      return matchState && matchDist && matchTal;
    });
    if (matching.length > 0) {
      setSelectedCollegeId(matching[0].id.toString());
    }
  };

  // Reset hierarchy filters
  const resetLocationHierarchy = () => {
    setSelectedState('ALL');
    setSelectedDistrict('ALL');
    setSelectedTaluk('ALL');
    if (colleges.length > 0) {
      setSelectedCollegeId(colleges[0].id.toString());
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;

        const enriched = colleges.map((c) => ({
          ...c,
          dist: calculateDistanceKm(userLat, userLon, c.latitude, c.longitude),
        })).sort((a, b) => a.dist - b.dist);

        setDetectingGps(false);
        if (enriched.length > 0) {
          const nearest = enriched[0];
          setSelectedCollegeId(nearest.id.toString());
          if (nearest.state) setSelectedState(nearest.state);
          if (nearest.district) setSelectedDistrict(nearest.district);
          if (nearest.taluk) setSelectedTaluk(nearest.taluk);
          setGpsMessage(`📍 Nearest: ${nearest.name} (~${nearest.dist} km away) in ${nearest.taluk || nearest.district}, ${nearest.state}`);
        }
      },
      (err) => {
        setDetectingGps(false);
        console.warn("GPS error:", err);
      },
      { timeout: 7000 }
    );
  };

  const handleMapLocationSelect = (loc) => {
    if (loc.state) setSelectedState(loc.state);
    if (loc.district) setSelectedDistrict(loc.district);
    if (loc.taluk) setSelectedTaluk(loc.taluk);
    if (loc.collegeId) {
      setSelectedCollegeId(loc.collegeId);
    } else if (loc.college?.id) {
      setSelectedCollegeId(loc.college.id.toString());
    }
    setGpsMessage(`📍 Pinned Location Selected: ${loc.college?.name || loc.taluk || loc.district} (${loc.taluk || loc.district}, ${loc.state})`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedCollegeId) {
      navigate(`/explore?collegeId=${selectedCollegeId}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-900 to-slate-900 text-white pt-20 pb-28">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Strictly 5 KM Radius College Accommodation</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Find Your Perfect Stay <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-300">
                Near Your College
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Discover verified hostels, PGs, and rental rooms strictly within 5 KM of your college gate. Say goodbye to long commutes and broker commissions.
            </p>

            {/* Location Feedback if GPS detected */}
            {gpsMessage && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md animate-fade-in">
                <span>{gpsMessage}</span>
              </div>
            )}

            {/* Location-Based Search Box: State -> District -> Taluk -> Campus */}
            <form
              onSubmit={handleSearch}
              className="mt-8 bg-white p-4 sm:p-5 rounded-3xl shadow-elevated border border-slate-100 text-slate-800 max-w-4xl mx-auto space-y-3"
            >
              {/* Header inside search box with Reset and GPS */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>Location-Based Search (State &gt; District &gt; Taluk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMapModalOpen(true)}
                    className="text-[11px] text-purple-700 hover:text-purple-800 font-extrabold flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 px-3 py-1 rounded-xl transition-all shadow-xs"
                    title="Pin exact location on interactive map to auto-detect State, District, and Taluk"
                  >
                    <Compass className="w-3.5 h-3.5 text-purple-600" />
                    <span>🗺️ Pin on Map</span>
                  </button>
                  {(selectedState !== 'ALL' || selectedDistrict !== 'ALL' || selectedTaluk !== 'ALL') && (
                    <button
                      type="button"
                      onClick={resetLocationHierarchy}
                      className="text-[11px] text-slate-500 hover:text-purple-600 font-bold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingGps}
                    className="text-[11px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-xl transition-all"
                  >
                    <Navigation className={`w-3 h-3 ${detectingGps ? 'animate-spin' : ''}`} />
                    <span>{detectingGps ? 'Locating...' : '📍 Near Me (GPS)'}</span>
                  </button>
                </div>
              </div>

              {/* 3 Cascading Dropdowns: State, District, Taluk */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                {/* State */}
                <div className="text-left px-3 py-1.5 bg-white rounded-xl border border-slate-200 focus-within:border-purple-500 transition-colors">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    1. State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-transparent font-bold text-navy-900 text-xs sm:text-sm focus:outline-none cursor-pointer py-0.5"
                  >
                    <option value="ALL">All States ({states.length})</option>
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="text-left px-3 py-1.5 bg-white rounded-xl border border-slate-200 focus-within:border-purple-500 transition-colors">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    2. District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-transparent font-bold text-navy-900 text-xs sm:text-sm focus:outline-none cursor-pointer py-0.5"
                  >
                    <option value="ALL">All Districts ({districts.length})</option>
                    {districts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taluk */}
                <div className="text-left px-3 py-1.5 bg-white rounded-xl border border-slate-200 focus-within:border-purple-500 transition-colors">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    3. Taluk
                  </label>
                  <select
                    value={selectedTaluk}
                    onChange={(e) => handleTalukChange(e.target.value)}
                    className="w-full bg-transparent font-bold text-navy-900 text-xs sm:text-sm focus:outline-none cursor-pointer py-0.5"
                  >
                    <option value="ALL">All Taluks ({taluks.length})</option>
                    {taluks.map((tlk) => (
                      <option key={tlk} value={tlk}>
                        {tlk}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Campus Dropdown + Search Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <div className="w-full flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-purple-500 transition-colors">
                  <Building className="w-5 h-5 text-purple-600 shrink-0" />
                  <div className="w-full text-left">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Select Campus ({filteredColleges.length} Colleges Available)
                    </label>
                    <select
                      value={selectedCollegeId}
                      onChange={(e) => setSelectedCollegeId(e.target.value)}
                      className="w-full bg-transparent font-bold text-navy-900 text-xs sm:text-sm focus:outline-none cursor-pointer truncate py-0.5"
                    >
                      {filteredColleges.length === 0 ? (
                        <option value="">No colleges match this location filter</option>
                      ) : (
                        filteredColleges.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.name} — {col.taluk || col.city}, {col.state}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCollegeId}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all shrink-0 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>Search 5 KM</span>
                </button>
              </div>
            </form>

            {/* Hero Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Haversine Verified Proximity</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin-Verified Properties</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Direct Owner Communication</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW CAMPUS STAY WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-2">
            Effortless 3-Step Search
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            How Campus Stay Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            We calculate exact geographic distances so you never book a stay too far from morning lectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft relative flex flex-col justify-between">
            <span className="absolute top-6 right-6 text-4xl font-black text-slate-100">01</span>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-6 border border-purple-100">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-navy-900 mb-2">Select Your College</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose your university or institute. Our system automatically anchors the latitude and longitude of your campus gates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-purple-600 flex items-center gap-1">
              <span>Campus coordinate mapping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-purple-200 shadow-card relative flex flex-col justify-between ring-2 ring-purple-600/10">
            <span className="absolute top-6 right-6 text-4xl font-black text-purple-100">02</span>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-purple-600/30">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-navy-900 mb-2">Strict 5 KM Radius Scan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our backend Haversine algorithm scans all approved accommodations and guarantees results within 5 KM distance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-purple-600 flex items-center gap-1">
              <span>Backend distance calculation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft relative flex flex-col justify-between">
            <span className="absolute top-6 right-6 text-4xl font-black text-slate-100">03</span>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6 border border-emerald-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-navy-900 mb-2">Book & Move In Direct</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Send a booking request with your expected move-in date directly to the owner. No brokers, no hidden surcharges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>Zero brokerage guarantee</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR ACCOMMODATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
              Verified Listings
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Popular College Accommodations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated hostels, PGs, and shared student apartments near premier institutes.
            </p>
          </div>

          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-purple-600 font-bold text-xs text-navy-900 hover:text-purple-600 transition-all shrink-0"
          >
            <span>View All Accommodations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-100 h-96 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={(p) => setActiveModalProperty(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE CAMPUS STAY */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-2">
              Student-First Benefits
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Why Students Choose Campus Stay
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed specifically to solve real housing headaches for college students and their families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-navy-900 text-sm mb-1">5 KM Strict Guarantee</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Properties farther than 5 KM are systematically blocked by backend mathematical filters.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-navy-900 text-sm mb-1">Admin Verification</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Owners verify government IDs and property photos are vetted before any stay is published.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-navy-900 text-sm mb-1">Meal & Laundry Details</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transparent information on hygienic mess food menus, Wi-Fi speed, and air conditioning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-navy-900 text-sm mb-1">Direct Booking</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct request messaging between verified students and owners with zero brokerage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED COLLEGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            Top Locations
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Featured Colleges
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Click any campus to instantly load approved accommodations within 5 KM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(`/explore?collegeId=${col.id}`)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-purple-400 shadow-soft hover:shadow-card transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                <img
                  src={col.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-navy-900/90 text-white text-xs font-bold backdrop-blur-sm">
                  {col.code}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-navy-900 text-base mb-1 group-hover:text-purple-600 transition-colors">
                  {col.name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{col.city}, {col.state}</span>
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-purple-600 pt-3 border-t border-slate-100">
                  <span>Explore nearby stays</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-navy-900 via-navy-800 to-purple-900 rounded-3xl p-8 sm:p-14 text-white">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-1">
              Community Voices
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Loved by Students Across Campuses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
              <div className="flex text-amber-400 gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-4">
                "Found my double-sharing hostel right behind IIT Delhi gate in under 15 minutes. The 5 KM proximity filter is a lifesaver!"
              </p>
              <div className="font-bold text-xs">
                <p className="text-white">Aarav Patel</p>
                <p className="text-purple-300 text-[10px]">IIT Delhi • B.Tech CS</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
              <div className="flex text-amber-400 gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-4">
                "Zero brokerage fee. The owner accepted my booking request within hours and confirmed my room. The mess food is genuinely good!"
              </p>
              <div className="font-bold text-xs">
                <p className="text-white">Priya Nair</p>
                <p className="text-purple-300 text-[10px]">RV College • 3rd Year</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
              <div className="flex text-amber-400 gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-4">
                "As an outstation student moving to Mumbai, seeing the exact distance on OpenStreetMap gave my parents complete peace of mind."
              </p>
              <div className="font-bold text-xs">
                <p className="text-white">Rohan Fernandes</p>
                <p className="text-purple-300 text-[10px]">St. Xavier's • Economics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details Modal */}
      {activeModalProperty && (
        <PropertyDetailModal
          property={activeModalProperty}
          onClose={() => setActiveModalProperty(null)}
        />
      )}

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setMapModalOpen(false)}
        colleges={colleges}
        initialCollege={colleges.find((c) => c.id.toString() === selectedCollegeId)}
        onSelectLocation={handleMapLocationSelect}
      />
    </div>
  );
};

export default HomePage;

