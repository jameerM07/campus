import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
                <Building className="w-5 h-5 text-purple-200" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                CAMPUS<span className="text-purple-400">STAY</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier college accommodation finder helping students discover verified hostels, PGs, and rental apartments strictly within 5 KM of top universities.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold bg-navy-800/80 px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Admin-Verified Listings • Zero Brokerage</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-purple-400 transition-colors">Explore 5 KM Stays</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/register/owner" className="hover:text-purple-400 transition-colors">List Your Property</Link>
              </li>
              <li>
                <Link to="/register/student" className="hover:text-purple-400 transition-colors">Student Registration</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">Member Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Featured Hubs */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">College Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">IIT Delhi (Hauz Khas)</span>
              </li>
              <li>
                <span className="text-slate-400">RV College (Bengaluru)</span>
              </li>
              <li>
                <span className="text-slate-400">St. Xavier's (Mumbai)</span>
              </li>
              <li>
                <span className="text-slate-400">Delhi University North</span>
              </li>
              <li>
                <span className="text-slate-400">Anna University Chennai</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Campus Stay HQ, Connaught Place, New Delhi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>support@campusstay.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Campus Stay Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for college students across India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

