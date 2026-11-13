import React, { useState } from 'react';
import { X, MapPin, Wifi, Utensils, Wind, Shield, Users, BedDouble, Calendar, Send, CheckCircle2, Phone, Mail, Building, Car, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PropertyDetailModal = ({ property, onClose, onBookingSuccess }) => {
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!property) return null;

  const images = property.imageUrls && property.imageUrls.length > 0 
    ? property.imageUrls 
    : [property.primaryImageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=explore');
      return;
    }
    if (!isStudent) {
      setErrorMessage('Only student accounts can send accommodation booking requests.');
      return;
    }
    if (!moveInDate) {
      setErrorMessage('Please select your expected move-in date.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      const res = await studentAPI.createBooking({
        propertyId: property.id,
        expectedMoveInDate: moveInDate,
        message: message.trim(),
      });
      setBookingSuccessMsg('Booking request sent successfully to the property owner! You can monitor the approval status in your Student Dashboard.');
      if (onBookingSuccess) onBookingSuccess(res.data.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-elevated border border-slate-100 overflow-hidden relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-navy-900 shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
            {/* Main Active Photo */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-inner">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {property.distanceKm !== undefined && (
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-navy-900/90 text-white text-xs font-bold backdrop-blur-sm shadow flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>{property.distanceKm.toFixed(1)} km from campus (Within 5 KM)</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 pb-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-purple-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-navy-900 text-white">
                  {property.propertyType}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                  {property.genderPreference} Only
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  {property.availableRooms} Available / {property.totalRooms} Total
                </span>
              </div>

              <h2 className="text-2xl font-black text-navy-900 mb-2 leading-snug">
                {property.title}
              </h2>

              <p className="text-sm text-slate-500 flex items-start gap-1.5 mb-6">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>{property.address}, {property.city}, {property.state} - {property.pinCode}</span>
              </p>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Amenities & Facilities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${property.wifi ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Wifi className="w-4 h-4 text-purple-600" />
                    <span>High-Speed Wi-Fi</span>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${property.ac ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Wind className="w-4 h-4 text-cyan-600" />
                    <span>Air Conditioning</span>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${property.foodAvailable ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span>Food / Mess</span>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${property.laundry ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Laundry Service</span>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${property.parking ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Car className="w-4 h-4 text-indigo-600" />
                    <span>Vehicle Parking</span>
                  </div>

                  <div className="p-3 rounded-xl border border-purple-200 bg-purple-50 text-xs font-semibold flex items-center gap-2.5 text-purple-900">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>24/7 Security</span>
                  </div>
                </div>

                {property.foodAvailable && property.foodDescription && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Meal Details:</strong>
                      {property.foodDescription}
                    </div>
                  </div>
                )}
              </div>

              {/* Owner Info Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Managed By Owner</span>
                  <p className="font-bold text-sm text-navy-900">{property.ownerName || 'Verified Property Owner'}</p>
                </div>
                {property.contactNumber && (
                  <a
                    href={`tel:${property.contactNumber}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{property.contactNumber}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Request Form */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/50 flex flex-col justify-between">
            <div>
              {/* Price Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Monthly Tariff</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-navy-900">
                    ₹{Number(property.monthlyRent).toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-500 font-medium text-sm">/ month</span>
                </div>
                {property.securityDeposit > 0 && (
                  <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex justify-between">
                    <span>Security Deposit:</span>
                    <strong className="text-slate-700">₹{Number(property.securityDeposit).toLocaleString('en-IN')} (Refundable)</strong>
                  </p>
                )}
              </div>

              {/* Booking Request Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
                <h3 className="text-base font-extrabold text-navy-900 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Send Booking Request</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Direct inquiry to owner. No advance brokerage fee required.
                </p>

                {bookingSuccessMsg ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs">
                    <div className="flex items-center gap-2 font-bold mb-1 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Request Delivered!</span>
                    </div>
                    <p className="leading-relaxed">{bookingSuccessMsg}</p>
                    <button
                      onClick={() => navigate('/student/dashboard')}
                      className="mt-3 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors"
                    >
                      View in My Dashboard
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                        {errorMessage}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Expected Move-In Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Message to Owner (Optional)
                      </label>
                      <textarea
                        rows="3"
                        placeholder="E.g., Hi, I am a 1st year B.Tech student joining this semester. Looking for a quiet room..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || property.availableRooms <= 0}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Sending Request...' : 'Submit Booking Request'}</span>
                    </button>

                    {!user && (
                      <p className="text-[11px] text-center text-slate-500">
                        You will be prompted to sign in with your student account.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Proximity Assurance Note */}
            <div className="mt-6 p-3.5 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center gap-3 text-xs text-purple-900">
              <Shield className="w-5 h-5 text-purple-600 shrink-0" />
              <span>
                <strong>5 KM Verified Campus Stay:</strong> Guaranteed within 5 kilometers of university gate.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;

