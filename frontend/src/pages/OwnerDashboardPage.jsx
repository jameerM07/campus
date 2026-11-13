import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ownerAPI, collegeAPI, uploadAPI } from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { 
  Building, 
  PlusCircle, 
  ListOrdered, 
  Bell, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  Trash2, 
  Edit3, 
  Users, 
  BedDouble, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & State
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  // Add / Edit Property Form State
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [formCollegeId, setFormCollegeId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'HOSTEL',
    description: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110016',
    latitude: 28.5450,
    longitude: 77.1926,
    monthlyRent: 9000,
    securityDeposit: 10000,
    roomSharingType: 'DOUBLE',
    totalRooms: 10,
    availableRooms: 3,
    genderPreference: 'BOYS',
    foodAvailable: true,
    foodDescription: '3 meals daily included (Breakfast, Lunch, Dinner)',
    wifi: true,
    laundry: true,
    parking: false,
    ac: true,
    contactNumber: user?.phoneNumber || '+91 9811223344',
    imageUrls: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingProperty, setSubmittingProperty] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Booking action state
  const [actionNote, setActionNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, propsRes, bookingsRes, notifRes, collegesRes] = await Promise.all([
        ownerAPI.getDashboard(),
        ownerAPI.getMyProperties(),
        ownerAPI.getIncomingBookings(),
        ownerAPI.getNotifications(),
        collegeAPI.getAllColleges(),
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (propsRes.data?.data) setProperties(propsRes.data.data);
      if (bookingsRes.data?.data) setBookings(bookingsRes.data.data);
      if (notifRes.data?.data) setNotifications(notifRes.data.data);
      if (collegesRes.data?.data) {
        setColleges(collegesRes.data.data);
        if (collegesRes.data.data.length > 0 && !formCollegeId) {
          setFormCollegeId(collegesRes.data.data[0].id.toString());
          setFormData((prev) => ({
            ...prev,
            latitude: collegesRes.data.data[0].latitude + 0.005, // offset slightly to be ~0.6 km away
            longitude: collegesRes.data.data[0].longitude + 0.005,
            city: collegesRes.data.data[0].city,
            state: collegesRes.data.data[0].state,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load owner data:", err);
    } finally {
      setLoading(false);
    }
  };

  // College select in form automatically syncs suggested coordinates!
  const handleCollegeSelectInForm = (colId) => {
    setFormCollegeId(colId);
    const col = colleges.find((c) => c.id.toString() === colId);
    if (col) {
      setFormData((prev) => ({
        ...prev,
        city: col.city,
        state: col.state,
        latitude: parseFloat((col.latitude + 0.004).toFixed(6)), // within 1 km
        longitude: parseFloat((col.longitude + 0.004).toFixed(6)),
      }));
    }
  };

  // Image Upload handler
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadAPI.uploadFile(file);
      const url = res.data?.data?.imageUrl;
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, url] }));
      }
    } catch (err) {
      alert("Image upload failed. You can also paste an image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addImageUrlManually = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const removeImageUrl = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Handle Add / Edit Property Submission
  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingProperty(true);
      const payload = {
        ...formData,
        collegeId: formCollegeId ? parseInt(formCollegeId) : null,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      if (editingPropertyId) {
        await ownerAPI.updateProperty(editingPropertyId, payload);
        setStatusMessage("Property listing updated successfully.");
      } else {
        await ownerAPI.createProperty(payload);
        setStatusMessage("New property submitted successfully! It is pending administrator verification.");
      }

      setEditingPropertyId(null);
      setActiveTab('properties');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save property.");
    } finally {
      setSubmittingProperty(false);
    }
  };

  // Room Availability update
  const handleAvailabilityChange = async (propertyId, newCount) => {
    if (newCount < 0) return;
    try {
      await ownerAPI.updateAvailability(propertyId, newCount);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, availableRooms: newCount } : p))
      );
    } catch (err) {
      alert("Failed to update room availability");
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to permanently delete this property listing?")) return;
    try {
      await ownerAPI.deleteProperty(propertyId);
      setStatusMessage("Property deleted successfully.");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property.");
    }
  };

  // Accept or Reject booking
  const handleBookingAction = async (bookingId, status) => {
    try {
      await ownerAPI.updateBookingStatus(bookingId, {
        status,
        ownerNotes: actionNote.trim() || undefined,
      });
      setStatusMessage(`Booking request ${status.toLowerCase()}ed.`);
      setActionNote('');
      loadData();
    } catch (err) {
      alert("Failed to update booking status.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-navy-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/20 mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Accommodation Owner Portal</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.fullName || 'Owner'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your student accommodations, update room availability, and review booking inquiries.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPropertyId(null);
            setActiveTab('add-property');
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Accommodation</span>
        </button>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-900 hover:opacity-75">✕</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadNotificationsCount={unreadCount}
        />

        {/* Dynamic Content Pane */}
        <main className="flex-1 w-full space-y-6">
          
          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Total Properties"
                  value={stats?.myPropertiesCount || properties.length}
                  subtitle="Under your account"
                  icon={Building}
                  color="navy"
                />
                <StatCard
                  title="Approved & Live"
                  value={stats?.myApprovedCount || properties.filter(p => p.status === 'APPROVED').length}
                  subtitle="Visible in 5 KM search"
                  icon={CheckCircle2}
                  color="emerald"
                />
                <StatCard
                  title="Pending Admin Review"
                  value={stats?.myPendingCount || properties.filter(p => p.status === 'PENDING').length}
                  subtitle="Awaiting admin approval"
                  icon={Clock}
                  color="amber"
                />
                <StatCard
                  title="Available Vacant Rooms"
                  value={stats?.myAvailableRooms || properties.reduce((acc, p) => acc + (p.availableRooms || 0), 0)}
                  subtitle="Ready for student move-in"
                  icon={BedDouble}
                  color="purple"
                />
                <StatCard
                  title="Total Booking Inquiries"
                  value={stats?.myTotalBookingsCount || bookings.length}
                  subtitle="All-time student requests"
                  icon={ListOrdered}
                  color="navy"
                />
                <StatCard
                  title="Pending Requests"
                  value={stats?.myPendingBookingsCount || bookings.filter(b => b.status === 'PENDING').length}
                  subtitle="Requires your response"
                  icon={AlertCircle}
                  color="rose"
                />
              </div>

              {/* Quick Jump to Manage Properties */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-sm text-navy-900">Your Recent Properties</h3>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {properties.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-extrabold text-navy-900">{p.title}</h4>
                        <p className="text-slate-500">{p.address}, {p.city} • ₹{Number(p.monthlyRent).toLocaleString('en-IN')}/mo</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE PROPERTIES */}
          {activeTab === 'properties' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-900">My Properties</h2>
                  <p className="text-xs text-slate-500">Edit, manage occupancy, or remove listings.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPropertyId(null);
                    setActiveTab('add-property');
                  }}
                  className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition-colors"
                >
                  + Add Property
                </button>
              </div>

              {properties.length === 0 ? (
                <EmptyState
                  title="No Properties Added Yet"
                  description="List your first hostel, PG, or rental apartment to begin receiving student booking inquiries."
                  actionButton={
                    <button
                      onClick={() => setActiveTab('add-property')}
                      className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-xs"
                    >
                      Add Accommodation
                    </button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {properties.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={p.primaryImageUrl || (p.imageUrls && p.imageUrls[0])}
                          alt={p.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-navy-900">{p.title}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              p.status === 'APPROVED' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : p.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-500">{p.address}, {p.city} - {p.pinCode}</p>
                          <div className="text-xs text-slate-600 font-semibold flex flex-wrap gap-3 pt-1">
                            <span>₹{Number(p.monthlyRent).toLocaleString('en-IN')}/mo</span>
                            <span>•</span>
                            <span className="capitalize">{p.roomSharingType?.toLowerCase()} Sharing</span>
                            <span>•</span>
                            <span>{p.genderPreference}</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Availability Controls & Actions */}
                      <div className="flex flex-wrap items-center gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Vacancy Stepper */}
                        <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500">Available:</span>
                          <button
                            onClick={() => handleAvailabilityChange(p.id, p.availableRooms - 1)}
                            className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-xs text-navy-900 w-4 text-center">
                            {p.availableRooms}
                          </span>
                          <button
                            onClick={() => handleAvailabilityChange(p.id, p.availableRooms + 1)}
                            className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD NEW PROPERTY FORM */}
          {activeTab === 'add-property' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                  Property Submission
                </span>
                <h2 className="text-xl font-extrabold text-navy-900">
                  {editingPropertyId ? 'Edit Property Details' : 'List New Accommodation'}
                </h2>
                <p className="text-xs text-slate-500">
                  New submissions automatically remain PENDING until approved by administration.
                </p>
              </div>

              <form onSubmit={handlePropertySubmit} className="space-y-6">
                
                {/* College Proximity Anchor */}
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100">
                  <label className="block text-xs font-bold text-purple-900 mb-1.5">
                    Nearest Target College Campus (5 KM Proximity Anchor) *
                  </label>
                  <select
                    value={formCollegeId}
                    onChange={(e) => handleCollegeSelectInForm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {Object.entries(
                      colleges.reduce((acc, col) => {
                        const grp = `${col.state || 'Other'} — ${col.district || col.city}`;
                        if (!acc[grp]) acc[grp] = [];
                        acc[grp].push(col);
                        return acc;
                      }, {})
                    ).map(([grp, list]) => (
                      <optgroup key={grp} label={`📍 ${grp}`}>
                        {list.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.taluk || c.city})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="text-[11px] text-purple-700 mt-1">
                    Latitude and longitude are auto-suggested to be within 1 KM of this campus.
                  </p>
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Name / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Green Palm Boys Luxury Hostel"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Type *</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="HOSTEL">Hostel</option>
                      <option value="PG">PG Stay</option>
                      <option value="RENTAL_ROOM">Rental Room</option>
                      <option value="APARTMENT">Apartment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Describe amenities, surroundings, room furniture, quiet hours..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                {/* Address & Geographic Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat/House, Street, Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="110016"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Latitude (for 5 KM map) *</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Longitude (for 5 KM map) *</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pricing & Rooms */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Rooms *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Available Rooms *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.availableRooms}
                      onChange={(e) => setFormData({ ...formData, availableRooms: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sharing & Gender & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Room Sharing Type *</label>
                    <select
                      value={formData.roomSharingType}
                      onChange={(e) => setFormData({ ...formData, roomSharingType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    >
                      <option value="SINGLE">Single Room</option>
                      <option value="DOUBLE">Double Sharing</option>
                      <option value="TRIPLE">Triple Sharing</option>
                      <option value="FOUR_PLUS">4+ Sharing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender Preference *</label>
                    <select
                      value={formData.genderPreference}
                      onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    >
                      <option value="BOYS">Boys Only</option>
                      <option value="GIRLS">Girls Only</option>
                      <option value="CO_ED">Co-ed / Any</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner Contact Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Amenities Checkboxes */}
                <div>
                  <span className="block text-xs font-bold text-slate-700 mb-2">Included Amenities</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wifi}
                        onChange={(e) => setFormData({ ...formData, wifi: e.target.checked })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span>Wi-Fi</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.ac}
                        onChange={(e) => setFormData({ ...formData, ac: e.target.checked })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span>AC</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.foodAvailable}
                        onChange={(e) => setFormData({ ...formData, foodAvailable: e.target.checked })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span>Food / Mess</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.laundry}
                        onChange={(e) => setFormData({ ...formData, laundry: e.target.checked })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span>Laundry</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span>Parking</span>
                    </label>
                  </div>
                </div>

                {formData.foodAvailable && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Meal / Food Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Pure veg breakfast, lunch and dinner included"
                      value={formData.foodDescription}
                      onChange={(e) => setFormData({ ...formData, foodDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                )}

                {/* Image Upload / Photo Gallery */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Property Photographs (Upload multiple or enter image URL)
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="url"
                        placeholder="Or paste external image URL (e.g. Unsplash)"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addImageUrlManually}
                        className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-purple-600"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Previews */}
                  <div className="flex flex-wrap gap-3">
                    {formData.imageUrls.map((url, i) => (
                      <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt="prop" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-xs opacity-80 hover:opacity-100"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingProperty}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {submittingProperty ? 'Submitting Property...' : 'Submit Accommodation for Admin Verification'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: BOOKING REQUESTS */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-900">Incoming Booking Requests</h2>
                  <p className="text-xs text-slate-500">Respond to students requesting accommodation at your properties.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  {bookings.length} Total Requests
                </span>
              </div>

              {bookings.length === 0 ? (
                <EmptyState
                  title="No Inquiries Yet"
                  description="When students browse your approved stays and request a booking, their inquiries appear here."
                />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-purple-600 block">{b.propertyTitle}</span>
                          <h4 className="font-extrabold text-sm text-navy-900">{b.studentName}</h4>
                          <p className="text-xs text-slate-500">
                            {b.studentEmail} • {b.studentPhone} • {b.collegeName} ({b.course || 'Student'})
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold self-start sm:self-auto ${
                          b.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="text-slate-500 block mb-1">
                          Expected Move-In: <strong className="text-navy-900">{b.expectedMoveInDate}</strong>
                        </span>
                        {b.message && (
                          <p className="text-slate-700 italic">"{b.message}"</p>
                        )}
                      </div>

                      {/* Action buttons if PENDING */}
                      {b.status === 'PENDING' && (
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input
                            type="text"
                            placeholder="Optional note / room number / instructions for student..."
                            value={actionNote}
                            onChange={(e) => setActionNote(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBookingAction(b.id, 'ACCEPTED')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                            >
                              Accept Booking
                            </button>
                            <button
                              onClick={() => handleBookingAction(b.id, 'REJECTED')}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
              <h2 className="text-lg font-extrabold text-navy-900">Notifications</h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <h4 className="font-extrabold text-navy-900 mb-1">{n.title}</h4>
                    <p className="text-slate-600">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;

