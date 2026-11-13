import React from 'react';
import { MapPin, Wifi, Utensils, Wind, Shield, Users, BedDouble, Heart, ChevronRight, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';

const PropertyCard = ({ property, onSelect, onToggleSaved, isSaved }) => {
  const { isStudent } = useAuth();

  const getGenderBadge = (gender) => {
    switch (gender) {
      case 'BOYS':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">Boys</span>;
      case 'GIRLS':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-pink-100 text-pink-800">Girls</span>;
      case 'CO_ED':
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">Co-ed</span>;
    }
  };

  const getPropertyTypeBadge = (type) => {
    switch (type) {
      case 'HOSTEL':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white">Hostel</span>;
      case 'PG':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-900 text-white">PG Stay</span>;
      case 'RENTAL_ROOM':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-900 text-white">Rental Room</span>;
      case 'APARTMENT':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-900 text-white">Apartment</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-white">{type}</span>;
    }
  };

  const primaryImage = property.primaryImageUrl || 
    (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80');

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-purple-300 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      {/* Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges on Top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {getPropertyTypeBadge(property.propertyType)}
          {getGenderBadge(property.genderPreference)}
        </div>

        {/* Distance from college badge */}
        {property.distanceKm !== undefined && property.distanceKm !== null && (
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-navy-900/90 text-white text-xs font-bold backdrop-blur-sm shadow flex items-center gap-1 z-10">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span>{property.distanceKm.toFixed(1)} km from college</span>
          </div>
        )}

        {/* Saved/Favorite button (student only) */}
        {isStudent && onToggleSaved && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved(property.id);
            }}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all z-20 ${
              isSaved || property.savedByCurrentUser
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600'
            }`}
            title="Save stay"
          >
            <Heart className={`w-4 h-4 ${isSaved || property.savedByCurrentUser ? 'fill-white' : ''}`} />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rent & Availability */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-extrabold text-navy-900">
                ₹{Number(property.monthlyRent).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>

            <div className="text-right">
              {property.availableRooms > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {property.availableRooms} {property.availableRooms === 1 ? 'room' : 'rooms'} left
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Fully Occupied
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-navy-900 text-base mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {property.title}
          </h3>

          {/* Address */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-3 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{property.address}, {property.city}</span>
          </p>

          {/* Amenities & Attributes Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 font-medium">
              <BedDouble className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="capitalize">{property.roomSharingType?.toLowerCase().replace('_', ' ')} Sharing</span>
            </div>
            
            <div className="flex items-center gap-1.5 font-medium">
              <Utensils className={`w-3.5 h-3.5 shrink-0 ${property.foodAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{property.foodAvailable ? 'Food Included' : 'No Food'}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Wifi className={`w-3.5 h-3.5 shrink-0 ${property.wifi ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{property.wifi ? 'High-Speed Wi-Fi' : 'No Wi-Fi'}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Wind className={`w-3.5 h-3.5 shrink-0 ${property.ac ? 'text-cyan-600' : 'text-slate-400'}`} />
              <span>{property.ac ? 'Air Conditioned' : 'Non-AC'}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {property.contactNumber && (
            <a
              href={`tel:${property.contactNumber}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Call Owner"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call</span>
            </a>
          )}

          <button
            onClick={() => onSelect(property)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-navy-900 hover:bg-purple-600 shadow-sm transition-all group-hover:bg-purple-600"
          >
            <span>View Details & Book</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

