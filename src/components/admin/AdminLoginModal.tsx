import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, X, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminModalOpen, closeAdminModal, loginAdmin } = useApp();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200/80 relative"
      >
        <button
          type="button"
          onClick={closeAdminModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
            Admin Authority Console
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Authorized State Counseling Officers only. Enter cryptographic administrator passcode to configure data sources.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Passcode
            </label>
            <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-rose-500 focus-within:bg-white rounded-2xl transition-all">
              <div className="pl-3.5 text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="admin-passcode-input"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter admin passcode..."
                autoFocus
                className="w-full py-3 pl-2.5 pr-4 text-sm font-mono text-slate-900 bg-transparent rounded-2xl outline-none placeholder:font-sans placeholder:text-slate-400"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle size={13} />
                Invalid passcode. Please enter the authorized administrator key.
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Authenticate & Open Console
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              Admin Key: <code className="font-mono text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">Prasanth#1121</code>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
