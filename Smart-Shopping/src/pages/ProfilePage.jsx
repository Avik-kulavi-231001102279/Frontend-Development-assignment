import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, updateProfile, logout } from '../features/auth/authSlice';
import { selectAllOrders } from '../features/orders/orderSelectors';
import { addToast } from '../features/preferences/preferenceSlice';
import { removeFromStorage, STORAGE_KEYS } from '../utils/localStorage';
import {
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  Edit3,
  Camera,
  User,
  Trash2,
} from 'lucide-react';

export const ProfilePage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const orders = useSelector(selectAllOrders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    pinCode: currentUser?.pinCode || '',
  });

  // Handle uploading custom photo from local disk/device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      dispatch(
        addToast({
          message: 'Please choose a valid image file (PNG, JPG, WebP).',
          type: 'error',
        })
      );
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      dispatch(
        addToast({
          message: 'Image size should be less than 3MB.',
          type: 'error',
        })
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        dispatch(updateProfile({ avatar: base64Data }));
        dispatch(
          addToast({
            message: 'Profile photo updated successfully!',
            type: 'success',
          })
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    dispatch(updateProfile({ avatar: null }));
    dispatch(addToast({ message: 'Profile photo removed.', type: 'info' }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
    dispatch(addToast({ message: 'Profile updated successfully!', type: 'success' }));
  };

  const handleLogout = () => {
    dispatch(logout());
    removeFromStorage(STORAGE_KEYS.AUTH);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      sessionStorage.removeItem('token');
    } catch {
      // Safe fallback
    }
    dispatch(addToast({ message: 'Signed out successfully.', type: 'info' }));
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 pb-16">
      {/* Header Profile Hero Card */}
      <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* User Profile Avatar Box with Hover Overlay */}
          <div className="relative group shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-2xl ring-4 ring-indigo-50 dark:ring-indigo-950/80 bg-slate-100 dark:bg-slate-800 shadow-md flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:ring-indigo-300 dark:hover:ring-indigo-700"
              title={currentUser?.avatar ? 'Click to change photo' : 'Click to upload photo'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser?.name || 'User Profile Photo'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <User className="w-10 h-10 mb-0.5" />
                  <span className="text-[10px] font-semibold text-slate-400">No Photo</span>
                </div>
              )}

              {/* Hover Overlay: "Update Photo" or "Upload Photo" */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 p-1 text-center backdrop-blur-[1px]">
                <Camera className="w-5 h-5 mb-1 text-indigo-300 animate-pulse" />
                <span className="text-[11px] font-bold leading-tight">
                  {currentUser?.avatar ? 'Update Photo' : 'Upload Photo'}
                </span>
                <span className="text-[9px] text-slate-300 opacity-90 mt-0.5">Click to choose</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload profile photo"
            />

            {currentUser?.avatar && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                title="Remove current photo"
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Remove photo"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {isEditing ? formData.name || 'Your Name' : currentUser?.name || 'Valued Customer'}
            </h1>
            <p className="text-xs font-mono text-slate-400">{currentUser?.email}</p>

            {/* Status Badges - Clean & Verified */}
            <div className="flex items-center gap-2 pt-0.5 justify-center sm:justify-start flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                ✓ Verified Account
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                {orders.length} Order(s) Placed
              </span>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Hover over your photo to upload or change your profile picture.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details or Edit Form & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Details / Form */}
        <div className="md:col-span-2 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-wider">
            Contact & Shipping Details
          </h3>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    PIN / Zip
                  </label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {currentUser?.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Number</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {currentUser?.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Shipping Address</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {currentUser?.address
                      ? `${currentUser.address}, ${currentUser.city}, ${currentUser.state} - ${currentUser.pinCode}`
                      : 'No address saved yet'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Order Navigation */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              My Orders & Activity
            </h4>
            <p className="text-xs text-slate-500">
              Track your past and ongoing package shipments, view receipts, and cancel orders.
            </p>
            <Link
              to="/orders"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>View Order History ({orders.length})</span>
              </div>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
