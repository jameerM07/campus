import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, collegeAPI, propertyAPI } from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import PropertyDetailModal from '../components/PropertyDetailModal';
import EmptyState from '../components/EmptyState';
import { 
  Compass, 
  CalendarCheck, 
  Heart, 
  Bell, 
  User, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');

  // Stats & Data
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [modalProperty, setModalProperty] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, savedRes, notifRes, collegesRes] = await Promise.all([
        studentAPI.getDashboard(),
        studentAPI.getMyBookings(),
        studentAPI.getSavedProperties(),
        studentAPI.getNotifications(),
        collegeAPI.getAllColleges(),
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (bookingsRes.data?.data) setBookings(bookingsRes.data.data);
      if (savedRes.data?.data) setSavedProperties(savedRes.data.data);
      if (notifRes.data?.data) setNotifications(notifRes.data.data);

      if (collegesRes.data?.data) {
        const colList = collegesRes.data.data;
        setColleges(colList);
        // Match user's college if possible
        const userCol = colList.find((c) => c.name.toLowerCase().includes(user?.collegeName?.toLowerCase() || ''));
        const activeCol = userCol || colList[0];
        setSelectedCollege(activeCol);

        // Fetch 5 KM properties for this college
        if (activeCol) {
          const propRes = await propertyAPI.searchProperties({
            collegeId: activeCol.id,
            maxDistance: 5.0,
          });
          if (propRes.data?.data) {
            setNearbyProperties(propRes.data.data);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load student dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Change college selection
  const handleCollegeChange = async (colId) => {
    const col = colleges.find((c) => c.id.toString() === colId);
    if (!col) return;
    setSelectedCollege(col);
    try {
      const res = await propertyAPI.searchProperties({
        collegeId: col.id,
        maxDistance: 5.0,
      });
      if (res.data?.data) {
        setNearbyProperties(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    try {
      await studentAPI.cancelBooking(bookingId);
      setStatusMessage("Booking request cancelled successfully.");
      const updated = await studentAPI.getMyBookings();
      if (updated.data?.data) setBookings(updated.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  // Toggle Save
  const handleToggleSaved = async (propId) => {
    try {
      await studentAPI.toggleSaveProperty(propId);
      const res = await studentAPI.getSavedProperties();
      if (res.data?.data) setSavedProperties(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await studentAPI.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-xs text-purple-200">
            {user?.course || 'Undergraduate'} • {user?.yearOfStudy || 'Student'} • {user?.collegeName || 'College Student'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
          <MapPin className="w-5 h-5 text-purple-300" />
          <div className="text-xs">
            <span className="text-purple-300 font-bold block">Campus Anchor:</span>
            <strong className="text-white font-extrabold">{selectedCollege?.code || 'Campus'} (5 KM Active)</strong>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-900 hover:opacity-75">✕</button>
        </div>
      )}

      {/* Main Grid: Sidebar + Active Tab Content */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadNotificationsCount={unreadCount}
        />

        {/* Dynamic Content Pane */}
        <main className="flex-1 w-full space-y-6">
          
          {/* TAB 1: 5 KM NEARBY STAYS & MAP */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              
              {/* College Switcher */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-navy-900">
                    5 KM Accommodation Search
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated from the selected college using Haversine coordinates formula.
                  </p>
                </div>

                <div className="w-full sm:w-auto">
                  <select
                    value={selectedCollege?.id || ''}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.taluk || c.city}, {c.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Map */}
              <div className="h-[380px] w-full">
                <PropertyMap
                  college={selectedCollege}
                  properties={nearbyProperties}
                  onSelectProperty={(p) => setModalProperty(p)}
                />
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onSelect={(p) => setModalProperty(p)}
                    onToggleSaved={handleToggleSaved}
                    isSaved={savedProperties.some((s) => s.id === prop.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MY BOOKINGS & REQUEST HISTORY */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-900">My Booking Requests</h2>
                  <p className="text-xs text-slate-500">Track approvals and responses from property owners.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  {bookings.length} Total Requests
                </span>
              </div>

              {bookings.length === 0 ? (
                <EmptyState
                  title="No Booking Requests Yet"
                  description="Explore stays within 5 KM of your college and submit a move-in inquiry."
                  actionButton={
                    <button
                      onClick={() => setActiveTab('search')}
                      className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-xs shadow-sm"
                    >
                      Find Nearby Stays
                    </button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-navy-900">{b.propertyTitle}</h4>
                          {b.status === 'ACCEPTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Accepted
                            </span>
                          ) : b.status === 'REJECTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Declined
                            </span>
                          ) : b.status === 'CANCELLED' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                              Cancelled
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-600" />
                          <span>{b.propertyAddress}</span>
                        </p>

                        <div className="text-xs text-slate-600 pt-1 flex flex-wrap gap-4">
                          <span>
                            Move-In: <strong>{b.expectedMoveInDate}</strong>
                          </span>
                          <span>
                            Rent: <strong>₹{Number(b.monthlyRent).toLocaleString('en-IN')}/mo</strong>
                          </span>
                          {b.ownerPhone && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {b.ownerPhone}
                            </span>
                          )}
                        </div>

                        {b.ownerNotes && (
                          <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                            <strong className="text-navy-900 block font-bold">Owner Note:</strong>
                            {b.ownerNotes}
                          </div>
                        )}
                      </div>

                      {b.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors shrink-0"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED PROPERTIES */}
          {activeTab === 'saved' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-navy-900">Saved / Favourite Stays</h2>
                <p className="text-xs text-slate-500">Quick access to properties you have bookmarked.</p>
              </div>

              {savedProperties.length === 0 ? (
                <EmptyState
                  title="No Saved Stays"
                  description="Click the heart icon on any property to save it here for later review."
                  icon={Heart}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isSaved={true}
                      onSelect={(p) => setModalProperty(p)}
                      onToggleSaved={handleToggleSaved}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-900">Notifications</h2>
                  <p className="text-xs text-slate-500">Updates regarding your bookings and requests.</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    Mark All As Read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <EmptyState title="No Notifications Yet" description="You have no notifications at this time." icon={Bell} />
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        n.isRead ? 'bg-white border-slate-200' : 'bg-purple-50/60 border-purple-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold text-xs text-navy-900 mb-1">{n.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-1"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STUDENT PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-navy-900">Student Profile</h2>
                <p className="text-xs text-slate-500">Your verified campus membership credentials.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Full Name</span>
                  <strong className="text-navy-900 text-sm font-extrabold">{user?.fullName}</strong>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Email Address</span>
                  <strong className="text-navy-900 text-sm font-extrabold">{user?.email}</strong>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Phone Number</span>
                  <strong className="text-navy-900 text-sm font-extrabold">{user?.phoneNumber}</strong>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">College</span>
                  <strong className="text-navy-900 text-sm font-extrabold">{user?.collegeName || 'Not Set'}</strong>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Course & Degree</span>
                  <strong className="text-navy-900 text-sm font-extrabold">{user?.course || 'Not Set'}</strong>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Year of Study</span>
                  <strong className="text-navy-900 text-sm font-extrabold">{user?.yearOfStudy || 'Not Set'}</strong>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Property Details Modal */}
      {modalProperty && (
        <PropertyDetailModal
          property={modalProperty}
          onClose={() => setModalProperty(null)}
          onBookingSuccess={() => {
            setModalProperty(null);
            studentAPI.getMyBookings().then((r) => setBookings(r.data?.data || []));
            setStatusMessage("Booking request successfully sent to the owner!");
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboardPage;

