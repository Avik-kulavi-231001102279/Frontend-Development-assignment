import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { simulateRegistration } from '../features/auth/authThunks';
import {
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from '../features/auth/authSlice';
import { addToast } from '../features/preferences/preferenceSlice';
import {
  ShoppingBag,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      const resultAction = await dispatch(
        simulateRegistration({ name: name.trim(), email: email.trim(), password })
      );

      if (simulateRegistration.fulfilled.match(resultAction)) {
        dispatch(
          addToast({
            message: `🎉 Account created successfully for ${name}! Please sign in.`,
            type: 'success',
            duration: 4000,
          })
        );
        // Requirement 5.A: Redirect to login after successful registration
        navigate('/login', {
          replace: true,
          state: {
            from: location.state?.from,
            registeredEmail: email.trim(),
            registeredMessage: 'Registration successful! Please log in with your credentials.',
          },
        });
      }
    } catch {
      // Errors handled via extraReducers
    }
  };

  const activeError = validationError || error;

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group"
            aria-label="ShopSphere Home"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              ShopSphere
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join ShopSphere for seamless checkout, discounts, and order tracking.
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          {activeError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{activeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) dispatch(clearAuthError());
                    if (validationError) setValidationError('');
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearAuthError());
                    if (validationError) setValidationError('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Password * (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearAuthError());
                    if (validationError) setValidationError('');
                  }}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ from: location.state?.from }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Secure Registration • Safe Shopping • Easy Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
