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
import { DEMO_USERS } from '../features/auth/authThunks';
import { ShoppingBag, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Intended redirect path (defaults to '/shop')
  const from = location.state?.from?.pathname || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const resultAction = await dispatch(
        simulateLogin({ email, password, rememberMe })
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
    } catch (err) {
      // Handled via extraReducers
    }
  };

  const fillDemoAccount = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    dispatch(clearAuthError());
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to ShopSphere
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your orders, saved cart items, and seamless checkout.
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Box for Testing */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Academic Demonstration Credentials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => fillDemoAccount(user)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-left hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {user.email}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  }}
                  placeholder="demo@shopsphere.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember Me</span>
              </label>

              <span className="text-slate-400 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                state={{ from: location.state?.from }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
