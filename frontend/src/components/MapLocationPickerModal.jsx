import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  Search, 
  Navigation, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Compass, 
  AlertCircle,
  Loader2
} from 'lucide-react';

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

// Custom Marker Icon for Pinned Location
const createPinIcon = () => {
  return L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.45);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 5px;
          animation: bounce 1.5s infinite;
        ">
          📍 <span style="letter-spacing: 0.5px;">Pinned College Location</span>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid #db2777;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
  });
};

// Custom Marker for Registered Colleges on Map
const createCollegeMarkerIcon = (code) => {
  return L.divIcon({
    className: 'custom-college-map-dot',
    html: `
      <div style="
        background: #1e1b4b;
        color: #e9d5ff;
        padding: 3px 7px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 700;
        white-space: nowrap;
        border: 1.5px solid #a855f7;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        cursor: pointer;
        transform: translate(-50%, -50%);
      ">
        🎓 ${code || 'College'}
      </div>
    `,
    iconSize: [0, 0],
  });
};

// Component to handle map clicks and pan
const MapClickHandler = ({ onPinDrop, center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, Math.max(map.getZoom(), 14), { duration: 1.2 });
    }
  }, [center, map]);

  useMapEvents({
    click(e) {
      onPinDrop(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

const MapLocationPickerModal = ({
  isOpen,
  onClose,
  colleges = [],
  initialCollege,
  onSelectLocation,
}) => {
  // Center defaults to India / selected college
  const defaultPos = initialCollege?.latitude && initialCollege?.longitude
    ? [initialCollege.latitude, initialCollege.longitude]
    : [12.9716, 77.5946]; // Bengaluru default

  const [pinnedCoords, setPinnedCoords] = useState(defaultPos);
  const [mapCenter, setMapCenter] = useState(defaultPos);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Detected location state
  const [detectedState, setDetectedState] = useState(initialCollege?.state || 'Karnataka');
  const [detectedDistrict, setDetectedDistrict] = useState(initialCollege?.district || 'Bengaluru Urban');
  const [detectedTaluk, setDetectedTaluk] = useState(initialCollege?.taluk || 'Bengaluru South (Kengeri)');
  const [detectedAddress, setDetectedAddress] = useState(initialCollege?.address || '');
  const [matchedCollege, setMatchedCollege] = useState(initialCollege || null);

  // Reverse Geocode when coordinates change
  const handlePinDrop = async (lat, lon) => {
    setPinnedCoords([lat, lon]);
    setMapCenter([lat, lon]);
    setGeocoding(true);

    // 1. First, check closest college in local database via Haversine
    let closestCollege = null;
    let minDistance = Infinity;

    if (colleges.length > 0) {
      colleges.forEach((c) => {
        if (c.latitude && c.longitude) {
          const d = calculateDistanceKm(lat, lon, c.latitude, c.longitude);
          if (d < minDistance) {
            minDistance = d;
            closestCollege = { ...c, distanceKm: d };
          }
        }
      });
      setMatchedCollege(closestCollege);
    }

    // 2. Query OpenStreetMap Nominatim for official State, District, and Taluk/City
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (resp.ok) {
        const data = await resp.json();
        const addr = data.address || {};

        // Extract State
        const state = addr.state || (closestCollege ? closestCollege.state : 'Unknown State');

        // Extract District / County
        const district =
          addr.state_district ||
          addr.county ||
          addr.district ||
          addr.city ||
          (closestCollege ? closestCollege.district : 'General District');

        // Extract Taluk / Suburb / Town
        const taluk =
          addr.suburb ||
          addr.town ||
          addr.city_district ||
          addr.neighbourhood ||
          addr.village ||
          addr.city ||
          (closestCollege ? closestCollege.taluk : district);

        setDetectedState(state);
        setDetectedDistrict(district);
        setDetectedTaluk(taluk);
        setDetectedAddress(data.display_name || `${taluk}, ${district}, ${state}`);
      } else {
        // Fallback to nearest college data
        if (closestCollege) {
          setDetectedState(closestCollege.state);
          setDetectedDistrict(closestCollege.district || closestCollege.city);
          setDetectedTaluk(closestCollege.taluk || closestCollege.city);
          setDetectedAddress(`${closestCollege.name}, ${closestCollege.city}`);
        }
      }
    } catch (err) {
      console.warn("Reverse geocode request failed, using nearest college fallback:", err);
      if (closestCollege) {
        setDetectedState(closestCollege.state);
        setDetectedDistrict(closestCollege.district || closestCollege.city);
        setDetectedTaluk(closestCollege.taluk || closestCollege.city);
        setDetectedAddress(`${closestCollege.name}, ${closestCollege.city}`);
      }
    } finally {
      setGeocoding(false);
    }
  };

  // Live institution / place search
  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const q = searchQuery.toLowerCase().trim();

    // 1. Search in existing college database
    const localMatches = colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.district && c.district.toLowerCase().includes(q)) ||
        (c.taluk && c.taluk.toLowerCase().includes(q)) ||
        (c.state && c.state.toLowerCase().includes(q))
    ).map((c) => ({
      name: c.name,
      subtext: `${c.taluk || c.city}, ${c.state}`,
      lat: c.latitude,
      lon: c.longitude,
      isRegisteredCollege: true,
      college: c,
    }));

    // 2. Query Nominatim for Indian places / universities
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=4&addressdetails=1`
      );
      if (resp.ok) {
        const data = await resp.json();
        const osmMatches = data.map((item) => ({
          name: item.display_name.split(',')[0],
          subtext: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          isRegisteredCollege: false,
        }));
        setSearchResults([...localMatches, ...osmMatches]);
      } else {
        setSearchResults(localMatches);
      }
    } catch (err) {
      setSearchResults(localMatches);
    } finally {
      setSearching(false);
    }
  };

  // GPS Locate User
  const handleUseMyGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        handlePinDrop(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGpsLoading(false);
        console.warn("GPS error:", err);
        alert("Could not access your device location. Please click on the map to pin.");
      },
      { timeout: 7000 }
    );
  };

  // Apply location and return to parent
  const handleConfirm = () => {
    if (onSelectLocation) {
      onSelectLocation({
        state: detectedState,
        district: detectedDistrict,
        taluk: detectedTaluk,
        college: matchedCollege,
        collegeId: matchedCollege ? matchedCollege.id.toString() : null,
        latitude: pinnedCoords[0],
        longitude: pinnedCoords[1],
        address: detectedAddress,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[92vh] max-h-[820px] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Pin College Location on Map
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-200 border border-purple-400/30">
                  Auto-Detect State &bull; District &bull; Taluk
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Click anywhere on the map or search an institution. We'll automatically identify the exact State, District, and Taluk.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          {/* Institution Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) setSearchResults([]);
              }}
              placeholder="Search any college, university, district, or landmark in India..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-xs"
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-all disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>

            {/* Dropdown suggestions */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-elevated border border-slate-200 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchResults([]);
                      setSearchQuery(item.name);
                      handlePinDrop(item.lat, item.lon);
                    }}
                    className="w-full text-left p-3 hover:bg-purple-50 transition-colors flex items-start gap-2.5"
                  >
                    <span className="text-sm mt-0.5">
                      {item.isRegisteredCollege ? '🎓' : '📍'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-navy-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.subtext}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleUseMyGps}
            disabled={gpsLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 text-purple-600 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Locating...' : 'My GPS Location'}</span>
          </button>
        </div>

        {/* Interactive Map Area */}
        <div className="relative flex-1 w-full bg-slate-100 overflow-hidden">
          <MapContainer
            center={pinnedCoords}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onPinDrop={handlePinDrop} center={mapCenter} />

            {/* Pinned location Marker */}
            {pinnedCoords && (
              <Marker
                position={pinnedCoords}
                icon={createPinIcon()}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    handlePinDrop(pos.lat, pos.lng);
                  },
                }}
              />
            )}

            {/* Existing College Markers for quick click */}
            {colleges.map((c) => {
              if (!c.latitude || !c.longitude) return null;
              return (
                <Marker
                  key={c.id}
                  position={[c.latitude, c.longitude]}
                  icon={createCollegeMarkerIcon(c.code || c.name.slice(0, 4))}
                  eventHandlers={{
                    click: () => {
                      handlePinDrop(c.latitude, c.longitude);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="block text-navy-900 font-bold">{c.name}</strong>
                      <span className="text-slate-500 block text-[11px]">{c.taluk || c.city}, {c.state}</span>
                      <button
                        onClick={() => handlePinDrop(c.latitude, c.longitude)}
                        className="mt-2 text-[10px] font-bold text-purple-600 hover:underline"
                      >
                        Pin Here
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Map Help Hint */}
          <div className="absolute top-3 left-3 z-[400] pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <span>👉 Click anywhere on map to pin college</span>
            </div>
          </div>

          {/* Loading overlay while reverse geocoding */}
          {geocoding && (
            <div className="absolute top-3 right-3 z-[400] bg-navy-900/90 text-white px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-fade-in">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Detecting Location Hierarchy...</span>
            </div>
          )}
        </div>

        {/* Live Detected Hierarchy Details & Confirmation Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Detected State */}
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="block text-[10px] font-extrabold text-purple-600 uppercase tracking-wider mb-0.5">
                1. Detected State
              </span>
              <strong className="text-sm font-extrabold text-navy-900 block truncate">
                {detectedState || 'Detecting...'}
              </strong>
            </div>

            {/* Detected District */}
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="block text-[10px] font-extrabold text-purple-600 uppercase tracking-wider mb-0.5">
                2. Detected District
              </span>
              <strong className="text-sm font-extrabold text-navy-900 block truncate">
                {detectedDistrict || 'Detecting...'}
              </strong>
            </div>

            {/* Detected Taluk / City */}
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="block text-[10px] font-extrabold text-purple-600 uppercase tracking-wider mb-0.5">
                3. Detected Taluk / Area
              </span>
              <strong className="text-sm font-extrabold text-navy-900 block truncate">
                {detectedTaluk || 'Detecting...'}
              </strong>
            </div>
          </div>

          {/* Nearest Campus Match & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs">
              {matchedCollege ? (
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Nearest Campus: <strong className="text-navy-900 font-extrabold">{matchedCollege.name}</strong>
                    {matchedCollege.distanceKm !== undefined && (
                      <span className="text-purple-600 font-bold ml-1">
                        (~{matchedCollege.distanceKm} km away)
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="truncate max-w-md">Pinned at: {detectedAddress || `${pinnedCoords[0].toFixed(4)}, ${pinnedCoords[1].toFixed(4)}`}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Select Location</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MapLocationPickerModal;

