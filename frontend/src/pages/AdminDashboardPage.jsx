import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import PropertyDetailModal from '../components/PropertyDetailModal';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Trash2, 
  Eye, 
  Search, 
  UserX, 
  UserCheck, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Admin Data State
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedReviewProperty, setSelectedReviewProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingPropId, setRejectingPropId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Search filter inside admin tabs
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingPropsRes, allPropsRes, verifRes, studentsRes, ownersRes, bookingsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getPendingProperties(),
        adminAPI.getAllProperties(),
        adminAPI.getVerifications(),
        adminAPI.getAllStudents(),
        adminAPI.getAllOwners(),
        adminAPI.getAllBookings(),
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (pendingPropsRes.data?.data) setPendingProperties(pendingPropsRes.data.data);
      if (allPropsRes.data?.data) setAllProperties(allPropsRes.data.data);
      if (verifRes.data?.data) setVerifications(verifRes.data.data);
      if (studentsRes.data?.data) setStudents(studentsRes.data.data);
      if (ownersRes.data?.data) setOwners(ownersRes.data.data);
      if (bookingsRes.data?.data) setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Property Actions
  const handleApproveProperty = async (propertyId) => {
    try {
      await adminAPI.approveProperty(propertyId);
      setStatusMessage("Property approved and published to live student searches.");
      loadAdminData();
    } catch (err) {
      alert("Failed to approve property.");
    }
  };

  const handleRejectProperty = async (propertyId) => {
    try {
      await adminAPI.rejectProperty(propertyId, rejectionReason || "Listing does not satisfy quality standards");
      setStatusMessage("Property listing rejected and owner notified.");
      setRejectingPropId(null);
      setRejectionReason('');
      loadAdminData();
    } catch (err) {
      alert("Failed to reject property.");
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await adminAPI.removeProperty(propertyId);
      setStatusMessage("Property removed by administrator.");
      loadAdminData();
    } catch (err) {
      alert("Failed to delete property.");
    }
  };

  // Owner Verification
  const handleVerifyOwner = async (verifId, approved) => {
    try {
      await adminAPI.verifyOwner(verifId, approved, approved ? null : "ID document invalid or unreadable");
      setStatusMessage(approved ? "Owner account verified successfully." : "Owner verification declined.");
      loadAdminData();
    } catch (err) {
      alert("Verification update failed.");
    }
  };

  // User Status Toggle (ACTIVE / SUSPENDED)
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      setStatusMessage(`User account status updated to ${newStatus}.`);
      loadAdminData();
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Banner */}
      <div className="bg-navy-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Console</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Campus Stay Admin Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System overview, owner identity verifications, property vetting, and dispute management.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-navy-800 px-4 py-2 rounded-2xl border border-navy-700 text-xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Approvals: <strong className="text-amber-300">{pendingProperties.length} Stays</strong></span>
        </div>
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
          unreadNotificationsCount={pendingProperties.length}
        />

        {/* Dynamic Content Pane */}
        <main className="flex-1 w-full space-y-6">
          
          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Students"
                  value={stats?.totalStudents || students.length}
                  subtitle="Active college users"
                  icon={Users}
                  color="purple"
                />
                <StatCard
                  title="Total Owners"
                  value={stats?.totalOwners || owners.length}
                  subtitle="Registered partners"
                  icon={Building}
                  color="navy"
                />
                <StatCard
                  title="Approved Properties"
                  value={stats?.approvedProperties}
                  subtitle="Live in 5 KM search"
                  icon={CheckCircle2}
                  color="emerald"
                />
                <StatCard
                  title="Pending Properties"
                  value={stats?.pendingProperties || pendingProperties.length}
                  subtitle="Action required"
                  icon={Clock}
                  color="amber"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Total Bookings"
                  value={stats?.totalBookings || bookings.length}
                  subtitle="All-time platform requests"
                  icon={FileText}
                  color="navy"
                />
                <StatCard
                  title="Accepted Bookings"
                  value={stats?.acceptedBookings}
                  subtitle="Confirmed stays"
                  icon={CheckCircle2}
                  color="emerald"
                />
                <StatCard
                  title="Pending Inquiries"
                  value={stats?.pendingBookings}
                  subtitle="Awaiting owner review"
                  icon={AlertCircle}
                  color="rose"
                />
              </div>

              {/* Pending Approvals Quick Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-sm text-navy-900">
                    Awaiting Property Approvals ({pendingProperties.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('pending-approvals')}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    Review All
                  </button>
                </div>

                {pendingProperties.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    All submitted properties have been reviewed. No pending approvals! 🎉
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingProperties.slice(0, 3).map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-extrabold text-navy-900">{p.title}</h4>
                          <p className="text-slate-600">Owner: {p.ownerName} • {p.city} • ₹{Number(p.monthlyRent).toLocaleString('en-IN')}/mo</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveProperty(p.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setSelectedReviewProperty(p)}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PENDING APPROVALS */}
          {activeTab === 'pending-approvals' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-navy-900">Pending Property Listings Review</h2>
                <p className="text-xs text-slate-500">
                  Carefully vet address, photos, and rent fairness before publishing to student searches.
                </p>
              </div>

              {pendingProperties.length === 0 ? (
                <EmptyState
                  title="Zero Pending Approvals"
                  description="All accommodation submissions have been reviewed and decided."
                  icon={CheckCircle2}
                />
              ) : (
                <div className="space-y-4">
                  {pendingProperties.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 hover:bg-white transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={p.primaryImageUrl || (p.imageUrls && p.imageUrls[0])}
                            alt={p.title}
                            className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-slate-100"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-navy-900 text-white">
                              {p.propertyType}
                            </span>
                            <h3 className="font-extrabold text-base text-navy-900">{p.title}</h3>
                            <p className="text-xs text-slate-500">{p.address}, {p.city} - {p.pinCode}</p>
                            <p className="text-xs text-slate-700">
                              Owner: <strong>{p.ownerName}</strong> ({p.ownerPhone} • {p.ownerEmail})
                            </p>
                            <div className="text-xs font-bold text-navy-900 pt-1 flex gap-3">
                              <span>₹{Number(p.monthlyRent).toLocaleString('en-IN')}/mo</span>
                              <span>•</span>
                              <span>{p.availableRooms} rooms available</span>
                              <span>•</span>
                              <span>{p.genderPreference}</span>
                            </div>
                          </div>
                        </div>

                        {/* Inspection trigger */}
                        <button
                          onClick={() => setSelectedReviewProperty(p)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold self-start"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect Full Details</span>
                        </button>
                      </div>

                      {/* Approval / Rejection Box */}
                      {rejectingPropId === p.id ? (
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                          <label className="block text-xs font-bold text-rose-900">
                            State Reason for Listing Rejection:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Incomplete address / Blurred photographs / Incorrect rent..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rose-300 text-xs focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRejectProperty(p.id)}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => { setRejectingPropId(null); setRejectionReason(''); }}
                              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleApproveProperty(p.id)}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Publish Listing</span>
                          </button>

                          <button
                            onClick={() => setRejectingPropId(p.id)}
                            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALL PROPERTIES MANAGEMENT */}
          {activeTab === 'all-properties' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-900">All Accommodations ({allProperties.length})</h2>
                  <p className="text-xs text-slate-500">Monitor all platform inventory across colleges.</p>
                </div>

                <input
                  type="text"
                  placeholder="Filter by title, city, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-64 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                {allProperties
                  .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-navy-900">{p.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-slate-500">{p.address}, {p.city} • ₹{Number(p.monthlyRent).toLocaleString('en-IN')}/mo</p>
                        <p className="text-slate-600">Owner: <strong>{p.ownerName}</strong> ({p.ownerEmail})</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReviewProperty(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleRemoveProperty(p.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: OWNER VERIFICATIONS */}
          {activeTab === 'owner-verifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-navy-900">Owner Identity Verifications</h2>
                <p className="text-xs text-slate-500">Examine government identity documentation for accommodation owners.</p>
              </div>

              <div className="space-y-4">
                {verifications.map((v) => (
                  <div key={v.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-navy-900">{v.user?.fullName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          v.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                          v.verificationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {v.verificationStatus}
                        </span>
                      </div>
                      <p className="text-slate-600">Email: {v.user?.email} • Phone: {v.user?.phoneNumber}</p>
                      <p className="text-slate-700">
                        Document: <strong>{v.documentType}</strong> (Number: <code className="bg-white px-2 py-0.5 rounded border">{v.documentNumber}</code>)
                      </p>
                    </div>

                    {v.verificationStatus === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyOwner(v.id, true)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Verify & Approve
                        </button>
                        <button
                          onClick={() => handleVerifyOwner(v.id, false)}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">Processed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: STUDENTS & USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-navy-900">Registered Students & Accounts</h2>
                <p className="text-xs text-slate-500">Monitor active user registrations, courses, and account status.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">College</th>
                      <th className="py-3 px-4">Course & Year</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-navy-900">
                          <div>{s.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{s.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{s.collegeName || 'General Student'}</td>
                        <td className="py-3.5 px-4 text-slate-600">{s.course || '-'} ({s.yearOfStudy || '-'})</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleUserStatus(s.id, s.status)}
                            className="text-xs font-bold text-purple-600 hover:underline"
                          >
                            {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ALL BOOKINGS OVERVIEW */}
          {activeTab === 'all-bookings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-navy-900">Platform Bookings Monitor ({bookings.length})</h2>
                <p className="text-xs text-slate-500">Audit all student booking requests across properties.</p>
              </div>

              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-navy-900">{b.propertyTitle}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          b.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-slate-600">Student: <strong>{b.studentName}</strong> ({b.studentEmail})</p>
                      <p className="text-slate-500">Move-In Date: {b.expectedMoveInDate} • Monthly Rent: ₹{Number(b.monthlyRent).toLocaleString('en-IN')}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      Created: {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Inspection Modal for Property Details */}
      {selectedReviewProperty && (
        <PropertyDetailModal
          property={selectedReviewProperty}
          onClose={() => setSelectedReviewProperty(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;

