import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
          Support & Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
          We're Here to Help You Settle In
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about a property listing, owner verification, or college radius mapping? Reach out anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Information Card */}
        <div className="lg:col-span-5 bg-navy-900 rounded-3xl p-8 text-white space-y-8 shadow-card">
          <div>
            <h3 className="text-lg font-black mb-2">Campus Stay Support HQ</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our student support desk is open Monday to Saturday, 9:00 AM to 7:00 PM IST.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-purple-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Corporate Office</span>
                <p className="text-white font-semibold">Campus Stay Tech Hub, Barakhamba Road, Connaught Place, New Delhi 110001</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-purple-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Phone Helpline</span>
                <p className="text-white font-semibold">+91 98765 43210 / +91 11 2345 6789</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-purple-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Email Support</span>
                <p className="text-white font-semibold">support@campusstay.com / help@campusstay.com</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-xs text-purple-200">
            <strong>For Accommodation Owners:</strong> To expedite pending property approvals, ensure your uploaded identity document numbers match your government records.
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-navy-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. A Campus Stay campus support associate will review your query and reply via email within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Priya Nair"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiring about IIT Delhi stay / Owner verification status"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="How can we assist you with accommodation or property listing?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

