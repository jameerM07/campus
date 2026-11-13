import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  Compass, 
  CalendarCheck, 
  Heart, 
  Bell, 
  User, 
  LogOut, 
  PlusCircle, 
  ListOrdered, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  CheckCircle,
  FileText
} from 'lucide-react';

const DashboardSidebar = ({ activeTab, onSelectTab, unreadNotificationsCount = 0 }) => {
  const { user, logout, isStudent, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentNavItems = [
    { id: 'search', label: 'Find 5 KM Stays', icon: Compass },
    { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
    { id: 'saved', label: 'Saved Stays', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Student Profile', icon: User },
  ];

  const ownerNavItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'properties', label: 'My Properties', icon: Building },
    { id: 'add-property', label: 'Add New Property', icon: PlusCircle },
    { id: 'bookings', label: 'Booking Requests', icon: ListOrdered },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
  ];

  const adminNavItems = [
    { id: 'overview', label: 'Admin Overview', icon: BarChart3 },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: CheckCircle },
    { id: 'all-properties', label: 'All Properties', icon: Building },
    { id: 'owner-verifications', label: 'Owner Verifications', icon: ShieldCheck },
    { id: 'users', label: 'Students & Users', icon: Users },
    { id: 'all-bookings', label: 'Booking Overview', icon: FileText },
  ];

  const items = isStudent ? studentNavItems : isOwner ? ownerNavItems : adminNavItems;

  return (
    <aside className="w-full md:w-64 bg-white rounded-3xl p-5 border border-slate-200 shadow-soft shrink-0 flex flex-col justify-between">
      <div>
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-extrabold text-sm text-navy-900 truncate">{user?.fullName}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 inline-block">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-6 border-t border-slate-100 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

