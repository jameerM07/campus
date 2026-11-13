import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, Info, Phone, LogIn, UserPlus, LogOut, LayoutDashboard, Menu, X, Building, ShieldCheck, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isStudent, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOwner) return '/owner/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/login';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-navy-900 via-navy-800 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Building className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-navy-900 group-hover:text-purple-600 transition-colors">
                CAMPUS<span className="text-purple-600">STAY</span>
              </span>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider hidden sm:block">
                Find Your Stay. Feel at Home.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/explore') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              Explore Stays
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/about') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/contact') ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm border border-purple-200 transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  <span>
                    {isAdmin ? 'Admin Portal' : isOwner ? 'Owner Dashboard' : 'Student Dashboard'}
                  </span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-navy-900 leading-tight">{user.fullName}</p>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-block">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-navy-900 hover:text-purple-600 hover:bg-slate-100 transition-all"
                >
                  Log In
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-purple-400" />
                    <span>Register</span>
                  </button>

                  {registerDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-card border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setRegisterDropdownOpen(false)}
                    >
                      <Link
                        to="/register/student"
                        onClick={() => setRegisterDropdownOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-navy-900">Student Account</p>
                          <p className="text-xs text-slate-500">Find 5 KM stays & book rooms</p>
                        </div>
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <Link
                        to="/register/owner"
                        onClick={() => setRegisterDropdownOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                      >
                        <Building className="w-5 h-5 text-navy-800 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-navy-900">Property Owner</p>
                          <p className="text-xs text-slate-500">List hostels, PGs & apartments</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600"
          >
            <Compass className="w-5 h-5" />
            Explore Stays
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600"
          >
            <Info className="w-5 h-5" />
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600"
          >
            <Phone className="w-5 h-5" />
            Contact
          </Link>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-xl">
                  <p className="text-sm font-bold text-navy-900">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email} ({user.role})</p>
                </div>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-navy-900 font-bold text-sm hover:bg-slate-50"
                >
                  <LogIn className="w-4 h-4 text-purple-600" />
                  Sign In
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/register/student"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    Student Signup
                  </Link>
                  <Link
                    to="/register/owner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
                  >
                    Owner Signup
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

