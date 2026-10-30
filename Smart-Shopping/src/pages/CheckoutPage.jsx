import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTax,
  selectCartShipping,
  selectCartFinalTotal,
  selectAppliedCoupon,
} from '../features/cart/cartSelectors';
import { selectCurrentUser } from '../features/auth/authSlice';
import { placeOrder } from '../features/orders/orderThunks';
import { selectOrderLoading } from '../features/orders/orderSelectors';
import { selectCurrency, addToast } from '../features/preferences/preferenceSlice';
import { formatPrice } from '../utils/currency';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Check,
  Package,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const tax = useSelector(selectCartTax);
  const shipping = useSelector(selectCartShipping);
  const finalTotal = useSelector(selectCartFinalTotal);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const currentUser = useSelector(selectCurrentUser);
  const isPlacingOrder = useSelector(selectOrderLoading);
  const currency = useSelector(selectCurrency);

  // Step 2: Shipping Form State (Pre-filled from auth profile)
  const [shippingData, setShippingData] = useState({
    fullName: currentUser?.name || 'Alex Morgan',
    email: currentUser?.email || 'demo@shopsphere.com',
    phone: currentUser?.phone || '+1 (555) 234-5678',
    address: currentUser?.address || '742 Evergreen Terrace, Suite 101',
    city: currentUser?.city || 'Springfield',
    state: currentUser?.state || 'Oregon',
    pinCode: currentUser?.pinCode || '97477',
  });

  // Step 3: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: currentUser?.name || 'Alex Morgan',
    expiry: '12/28',
    cvv: '•••',
  });
  const [upiId, setUpiId] = useState('alex@okhdfcbank');

  // Form error state
  const [formErrors, setFormErrors] = useState({});

  // Validation for Step 2
  const validateShipping = () => {
    const errors = {};
    if (!shippingData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!shippingData.email.trim() || !shippingData.email.includes('@'))
      errors.email = 'Valid Email is required';
    if (!shippingData.phone.trim()) errors.phone = 'Phone number is required';
    if (!shippingData.address.trim()) errors.address = 'Street Address is required';
    if (!shippingData.city.trim()) errors.city = 'City is required';
    if (!shippingData.state.trim()) errors.state = 'State is required';
    if (!shippingData.pinCode.trim()) errors.pinCode = 'PIN/Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (cartItems.length === 0) {
        dispatch(addToast({ message: 'Your cart is empty!', type: 'error' }));
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateShipping()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        items: cartItems,
        subtotal,
        discount,
        tax,
        shipping,
        totalAmount: finalTotal,
        shippingAddress: shippingData,
        paymentMethod,
        appliedCoupon: appliedCoupon?.code || null,
      };

      const resultAction = await dispatch(placeOrder(orderPayload));

      if (placeOrder.fulfilled.match(resultAction)) {
        const createdOrder = resultAction.payload;
        dispatch(
          addToast({
            message: `🎉 Order placed successfully! Order ID: ${createdOrder.id}`,
            type: 'success',
            duration: 4000,
          })
        );
        navigate(`/order-confirmation/${createdOrder.id}`, {
          state: { order: createdOrder },
        });
      }
    } catch (err) {
      dispatch(addToast({ message: 'Failed to place order. Try again.', type: 'error' }));
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Your cart is currently empty</h2>
        <p className="text-sm text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs"
        >
          Browse Products &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8 pb-16">
      {/* Stepper Header */}
      <CheckoutSteps currentStep={currentStep} />

      {/* Main Form Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Interactive Step Content */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          {/* STEP 1: CART REVIEW */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 1: Review Cart Items ({cartItems.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Verify the items and quantities in your order before entering shipping details.
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-100 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Qty: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.quantity}</span> × {formatPrice(item.price, currency)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 2: Shipping Information
                </h2>
                <p className="text-xs text-slate-500">
                  Where should we deliver your order? (Pre-filled from your profile)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.city && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.state && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.state}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    PIN / ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={shippingData.pinCode}
                    onChange={(e) => setShippingData({ ...shippingData, pinCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.pinCode && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.pinCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 3: Select Payment Method
                </h2>
                <p className="text-xs text-slate-500">
                  Simulated payment options (no real financial transaction will occur).
                </p>
              </div>

              <div className="space-y-3">
                {/* Credit Card Option */}
                <div
                  onClick={() => setPaymentMethod('Credit / Debit Card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'Credit / Debit Card'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Credit / Debit Card
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Visa, Mastercard, Amex (Simulated)
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Credit / Debit Card' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {paymentMethod === 'Credit / Debit Card' && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {paymentMethod === 'Credit / Debit Card' && (
                    <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={cardData.cardNumber}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={cardData.expiry}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={cardData.cvv}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          UPI / QR Code
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Google Pay, PhonePe, Paytm (Simulated)
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {paymentMethod === 'UPI' && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Pay directly upon home parcel arrival
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {paymentMethod === 'Cash on Delivery' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 & 5: FINAL ORDER REVIEW & CONFIRM */}
          {currentStep >= 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 4: Review and Place Order
                </h2>
                <p className="text-xs text-slate-500">
                  Please review your delivery details and order contents before placing.
                </p>
              </div>

              {/* Delivery info summary box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Deliver To:
                    </span>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-indigo-600 text-[11px] font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {shippingData.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {shippingData.address}, {shippingData.city}, {shippingData.state} - {shippingData.pinCode}
                  </p>
                  <p className="text-xs text-slate-500">
                    {shippingData.phone}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Payment Mode:
                    </span>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-indigo-600 text-[11px] font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {paymentMethod}
                  </p>
                  <p className="text-xs text-slate-500">
                    Status: <span className="text-emerald-600 font-semibold">Simulated Gateway Ready</span>
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.title} className="w-8 h-8 object-contain bg-white rounded-lg p-0.5 border" />
                      <span className="text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs font-medium">
                        {item.title} (x{item.quantity})
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons for Checkout */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Cart</span>
              </Link>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Order Cost Breakdown Card */}
        <div className="lg:col-span-1 sticky top-24 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Order Total Summary
          </h3>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPrice(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span>-{formatPrice(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPrice(tax, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {shipping === 0 ? 'FREE' : formatPrice(shipping, currency)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900 dark:text-white">Amount to Pay:</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                {formatPrice(finalTotal, currency)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-slate-400 text-[11px] border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Simulated Instant Confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
