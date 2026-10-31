import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { simulateLogin } from '../features/auth/authThunks';
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
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState(() => location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [clientError, setClientError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Intended redirect path (defaults to '/dashboard' for authenticated Shopping Dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');

    if (!email.trim()) {
      setClientError('Please enter your email address.');
      return;
    }
    if (!password) {
      setClientError('Please enter your password.');
      return;
    }

    try {
      const resultAction = await dispatch(
        simulateLogin({ email: email.trim(), password, rememberMe })
      );

      if (simulateLogin.fulfilled.match(resultAction)) {
        dispatch(
          addToast({
            message: `Welcome back, ${resultAction.payload.user.name}!`,
            type: 'success',
          })
        );
        navigate(from, { replace: true });
      }
    } catch {
      // Errors handled via extraReducers
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      dispatch(
        addToast({
          message: 'Please enter your email address above to receive a reset link.',
          type: 'info',
        })
      );
      return;
    }
    dispatch(
      addToast({
        message: `A password reset link has been sent to ${email.trim()}.`,
        type: 'info',
        duration: 4000,
      })
    );
  };

  const activeError = clientError || error;

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* 1. ShopSphere Logo and Branding */}
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

          {/* 2. Heading: "Welcome Back" */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            Welcome Back
          </h1>

          {/* 3. Subtitle: "Sign in to continue your shopping experience." */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your shopping experience.
          </p>
        </div>

        {/* Registered Success Banner if redirected from registration */}
        {location.state?.registeredMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{location.state.registeredMessage}</span>
          </div>
        )}

        {/* Login Form Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          {activeError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{activeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 4. Email Address input field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearAuthError());
                    if (clientError) setClientError('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* 5. Password input field with show/hide password functionality */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearAuthError());
                    if (clientError) setClientError('');
                  }}
                  placeholder="Enter your password"
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

            {/* 6. Remember Me & 7. Forgot Password Link */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* 8. Professional Sign In Button with Loading State */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 9. "Don't have an account? Register here" Link */}
          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                state={{ from: location.state?.from }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* 10. Small Trust Message: "Secure Login • Safe Shopping • Easy Checkout" */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Secure Login • Safe Shopping • Easy Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
