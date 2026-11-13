import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Dynamic map view updater
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 14, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom HTML DivIcons for 100% reliability without broken PNG image assets
const createCollegeIcon = (name) => {
  return L.divIcon({
    className: 'custom-college-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: #7c3aed;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          🎓 <span>${name || 'College'}</span>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #7c3aed;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
  });
};

const createPropertyIcon = (price, isSelected) => {
  return L.divIcon({
    className: 'custom-property-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        cursor: pointer;
      ">
        <div style="
          background: ${isSelected ? '#9333ea' : '#0f172a'};
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.3);
          border: 2px solid white;
        ">
          ₹${price ? Number(price).toLocaleString('en-IN') : ''}
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${isSelected ? '#9333ea' : '#0f172a'};
        "></div>
      </div>
    `,
    iconSize: [0, 0],
  });
};

const PropertyMap = ({ college, properties = [], selectedProperty, onSelectProperty }) => {
  const defaultCenter = [28.5450, 77.1926]; // IIT Delhi fallback
  const center = college?.latitude && college?.longitude 
    ? [college.latitude, college.longitude] 
    : (properties.length > 0 ? [properties[0].latitude, properties[0].longitude] : defaultCenter);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-soft border border-slate-200 relative">
      {/* 5 KM Info Ribbon */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-700 pointer-events-auto">
        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
        <span>5 KM Proximity Radius Boundary Active</span>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapUpdater center={center} zoom={14} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 5 KM Radius Circle around College */}
        {college?.latitude && college?.longitude && (
          <Circle
            center={[college.latitude, college.longitude]}
            radius={5000} // 5,000 meters = 5 KM
            pathOptions={{
              color: '#7c3aed',
              fillColor: '#8b5cf6',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '6, 6',
            }}
          />
        )}

        {/* College Landmark Pin */}
        {college?.latitude && college?.longitude && (
          <Marker
            position={[college.latitude, college.longitude]}
            icon={createCollegeIcon(college.code || college.name)}
          >
            <Popup>
              <div className="p-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Selected Campus</span>
                <h4 className="font-bold text-sm text-navy-900">{college.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{college.address}</p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  All properties below are strictly within 5 KM
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Property Pins */}
        {properties.map((prop) => {
          if (!prop.latitude || !prop.longitude) return null;
          const isSelected = selectedProperty?.id === prop.id;

          return (
            <Marker
              key={prop.id}
              position={[prop.latitude, prop.longitude]}
              icon={createPropertyIcon(prop.monthlyRent, isSelected)}
              eventHandlers={{
                click: () => onSelectProperty && onSelectProperty(prop),
              }}
            >
              <Popup>
                <div className="w-56 overflow-hidden">
                  <img
                    src={prop.primaryImageUrl || (prop.imageUrls && prop.imageUrls[0])}
                    alt={prop.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-navy-900 font-extrabold text-sm">
                      ₹{Number(prop.monthlyRent).toLocaleString('en-IN')}/mo
                    </span>
                    <span className="text-purple-600 text-[11px]">
                      {prop.distanceKm?.toFixed(1)} km away
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-navy-900 line-clamp-1 mb-1">{prop.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{prop.address}</p>
                  <button
                    onClick={() => onSelectProperty && onSelectProperty(prop)}
                    className="w-full py-1.5 bg-navy-900 hover:bg-purple-600 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    View Details & Book
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;

