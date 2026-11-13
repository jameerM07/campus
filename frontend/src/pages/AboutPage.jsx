import React from 'react';
import { Building, ShieldCheck, MapPin, Compass, Heart, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          <Building className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
          Find Your Stay. <br />
          <span className="text-purple-600">Feel at Home.</span>
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Campus Stay is India's dedicated college accommodation finder created to solve the stressful housing search for outstation college students and their families.
        </p>
      </div>

      {/* 5 KM Radius Philosophy */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
            Why 5 KM Distance Matters
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-snug">
            Zero Commute Stress for Better Academic Focus
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every semester, thousands of college students fall victim to misleading broker advertisements that claim "close to college", only to discover daily 45-minute commutes on crowded buses.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Campus Stay enforces a mathematical <strong>5-kilometer radius ceiling</strong> using the Haversine great-circle formula anchored right at university gates. If an accommodation is 5.1 kilometers away, our backend algorithm filters it out.
          </p>

          <div className="pt-2 flex flex-col gap-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Saves 10+ hours of transit every week</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe evening walks from libraries and labs</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero brokerage or third-party agent commission</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-card border border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center">
          <ShieldCheck className="w-10 h-10 text-purple-600 mx-auto mb-4" />
          <h3 className="font-extrabold text-navy-900 text-base mb-2">100% Admin Verified</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every property listing is vetted with government ID verification from accommodation owners before being published.
          </p>
        </div>

        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center">
          <Users className="w-10 h-10 text-navy-900 mx-auto mb-4" />
          <h3 className="font-extrabold text-navy-900 text-base mb-2">Student Community First</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Transparent room sharing information, food details, Wi-Fi speed, and student safety guidelines.
          </p>
        </div>

        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center">
          <Compass className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          <h3 className="font-extrabold text-navy-900 text-base mb-2">Interactive OpenStreetMap</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Visual Leaflet mapping with real walking distance estimates directly from your selected campus gates.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy-900 rounded-3xl p-10 text-center text-white space-y-4">
        <h3 className="text-2xl font-black">Ready to Find Your Home Away From Home?</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Explore approved hostels and PGs near IIT Delhi, RVCE Bengaluru, St. Xavier's Mumbai, and many more.
        </p>
        <Link
          to="/explore"
          className="inline-block px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all"
        >
          Explore 5 KM Stays Now
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;

