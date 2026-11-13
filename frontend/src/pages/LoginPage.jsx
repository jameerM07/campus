import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, ShieldCheck, User, LogIn, ArrowRight, KeyRound, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Role Tab: 'STUDENT', 'OWNER', 'ADMIN'
  const [activeRole, setActiveRole] = useState(
    searchParams.get('role')?.toUpperCase() || 'STUDENT'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = await login(email, password, activeRole);
      
      // Redirect to respective dashboard
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Autofill Helpers for painless instant testing
  const fillDemoCredentials = (role) => {
    setActiveRole(role);
    if (role === 'STUDENT') {
      setEmail('student.aarav@gmail.com');
      setPassword('password123');
    } else if (role === 'OWNER') {
      setEmail('owner.rajesh@gmail.com');
      setPassword('password123');
    } else if (role === 'ADMIN') {
      setEmail('admin@campusstay.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-elevated">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-purple-600/30">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Welcome Back to Campus Stay
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your role to access your dedicated dashboard.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveRole('STUDENT'); setError(null); }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'STUDENT'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('OWNER'); setError(null); }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'OWNER'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-navy-800" />
            <span>Owner</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('ADMIN'); setError(null); }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'ADMIN'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Admin</span>
          </button>
        </div>

        {/* Demo Fast Autofill Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-purple-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>One-Click Test Account Autofill:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoCredentials('STUDENT')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors"
            >
              Fill Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('OWNER')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-navy-200 text-navy-800 hover:bg-slate-100 transition-colors"
            >
              Fill Owner
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('ADMIN')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Fill Admin
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs font-semibold text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-navy-900 hover:bg-purple-600 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : `Sign In as ${activeRole}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          {activeRole === 'STUDENT' ? (
            <p>
              New student?{' '}
              <Link to="/register/student" className="font-bold text-purple-600 hover:underline">
                Create Student Account
              </Link>
            </p>
          ) : activeRole === 'OWNER' ? (
            <p>
              Want to list your property?{' '}
              <Link to="/register/owner" className="font-bold text-purple-600 hover:underline">
                Register as Property Owner
              </Link>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">
              Admin credentials are initialized by system seeding. Public admin registration is disabled for security.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

