import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { navigate } from '../../lib/router';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { user, login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect straight to admin
  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim();

    try {
      if (isRegisterMode) {
        try {
          await register(cleanEmail, password);
        } catch (regErr: any) {
          if (regErr.code === 'auth/email-already-in-use') {
            // If already registered, attempt login with the provided password
            await login(cleanEmail, password);
          } else {
            throw regErr;
          }
        }
      } else {
        try {
          await login(cleanEmail, password);
        } catch (loginErr: any) {
          // If invalid credentials, the user might be signing up for the first time
          if (loginErr.code === 'auth/invalid-credential' || loginErr.code === 'auth/user-not-found') {
            try {
              await register(cleanEmail, password);
            } catch (regErr: any) {
              if (regErr.code === 'auth/email-already-in-use') {
                throw new Error('Incorrect password for this account. Please verify your credentials and try again.');
              }
              if (regErr.code === 'auth/weak-password') {
                throw new Error('Password must be at least 6 characters.');
              }
              throw regErr;
            }
          } else {
            throw loginErr;
          }
        }
      }
      navigate('/admin');
    } catch (err: any) {
      console.warn('Authentication message:', err.code || err.message);
      let message = 'Failed to authenticate.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    const demoEmail = 'admin@affiliatestore.com';
    const demoPass = 'AdminPass123!';
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);

    try {
      try {
        await login(demoEmail, demoPass);
      } catch (loginErr: any) {
        if (loginErr.code === 'auth/invalid-credential' || loginErr.code === 'auth/user-not-found') {
          await register(demoEmail, demoPass);
        } else {
          throw loginErr;
        }
      }
      navigate('/admin');
    } catch (err: any) {
      console.warn('Demo login message:', err);
      setError('Could not complete demo sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-stone-900 tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Sign in to manage affiliate products, categories, and view click analytics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-stone-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-hidden transition-all text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-hidden transition-all text-stone-900"
                />
              </div>
            </div>

            <button
              id="admin-auth-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : isRegisterMode ? 'Create Admin Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Or</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <button
              id="admin-demo-signin-btn"
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Instant Demo Admin Sign-In</span>
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isRegisterMode
                ? 'Already have an admin account? Sign In'
                : 'Need to set up a new admin account? Register'}
            </button>
            <p className="text-[11px] text-stone-400">
              Tip: New admin accounts are also registered automatically on first sign-in.
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-stone-500 hover:text-stone-800"
            >
              ← Back to public storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
