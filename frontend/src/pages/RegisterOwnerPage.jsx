import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

const RegisterOwnerPage = () => {
  const { registerOwner } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    address: '',
    documentType: 'Aadhaar Card',
    documentNumber: '',
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await registerOwner(formData);
      navigate('/owner/dashboard');
    } catch (err) {
      console.error("Owner registration failed:", err);
      setError(err.response?.data?.message || 'Registration failed. Email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-elevated">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Building className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Register as Accommodation Owner
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            List your hostels, PGs and rental properties to college students near campuses.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Rajesh Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="owner@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                required
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 9811223344"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                minLength="6"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Owner Address / Office Location *</label>
            <input
              type="text"
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Hauz Khas Enclave, New Delhi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Identity Verification Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-xs text-navy-900 uppercase tracking-wider">
                Identity Verification Details
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Type *</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Commercial Trade License">Commercial Trade License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Number *</label>
                <input
                  type="text"
                  required
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  placeholder="e.g. 1234-5678-9012"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-[11px] text-purple-900 flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p>
              Your identity documents will be reviewed by Campus Stay administrators. You can immediately post properties, which will go live as soon as approved!
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-navy-900 hover:bg-purple-600 text-white font-extrabold text-xs shadow-md transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Submitting Registration...' : 'Complete Owner Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered as owner?{' '}
          <Link to="/login?role=owner" className="font-bold text-purple-600 hover:underline">
            Owner Log In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterOwnerPage;

