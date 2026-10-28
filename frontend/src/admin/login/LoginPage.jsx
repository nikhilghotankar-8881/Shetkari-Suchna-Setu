import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../auth/AdminAuthContext';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, verifyMFA, mfaPending } = useAdminAuth();

  const [email, setEmail] = useState('reviewer@shetkari.gov.in');
  const [password, setPassword] = useState('password123');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitialLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Generic error for security.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyMFA(totp);
      navigate('/admin/review');
    } catch (err) {
      setError('Invalid TOTP verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Admin Authentication
          </h2>
          <p className="text-xs text-stone-400">
            Shetkari Suchna Setu • Secure Access Gate
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Step 1: Email + Password */}
        {!mfaPending ? (
          <form onSubmit={handleInitialLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="admin@shetkari.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 touch-target"
            >
              <span>{loading ? 'Verifying...' : 'Proceed to MFA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: MFA TOTP */
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Two-Factor Authentication required. Enter the 6-digit code from your authenticator app.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                TOTP 6-Digit Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-3 text-sm font-mono tracking-widest text-center text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="123456"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                (Demo mode: enter any 6 digits like 123456)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 touch-target"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In & Verify'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-stone-800">
          <Link to="/schemes" className="text-xs text-stone-500 hover:text-stone-300 underline">
            ← Return to Farmer Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
