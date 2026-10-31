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
  Lock,
  User,
  MapPin,
  FileText,
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

  // Step 2: Customer Information Fields
  const [customerInfo, setCustomerInfo] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  // Step 3: Shipping Address Fields
  const [shippingAddress, setShippingAddress] = useState({
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    pinCode: currentUser?.pinCode || '',
  });

  // Step 4: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [cardNumber] = useState('•••• •••• •••• 4242');
  const [upiId, setUpiId] = useState('alex@okhdfcbank');

  // Form error state
  const [formErrors, setFormErrors] = useState({});

  // Validation for Step 2: Customer Info
  const validateCustomerInfo = () => {
    const errors = {};
    if (!customerInfo.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!customerInfo.email.trim() || !customerInfo.email.includes('@'))
      errors.email = 'Valid Email is required';
    if (!customerInfo.phone.trim()) errors.phone = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validation for Step 3: Shipping Address
  const validateShippingAddress = () => {
    const errors = {};
    if (!shippingAddress.address.trim()) errors.address = 'Street Address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state.trim()) errors.state = 'State is required';
    if (!shippingAddress.pinCode.trim()) errors.pinCode = 'PIN/Postal code is required';

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
      if (validateCustomerInfo()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (validateShippingAddress()) {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setCurrentStep(6);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Step 6: Place Order
  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        items: cartItems,
        subtotal,
        discount,
        tax,
        shipping,
        totalAmount: finalTotal,
        customerInfo,
        shippingAddress: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          ...shippingAddress,
        },
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
    } catch {
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
      {/* Stepper Header (6 Steps) */}
      <CheckoutSteps currentStep={currentStep} />

      {/* Main Form Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Interactive Step Content */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          {/* STEP 1: ORDER REVIEW */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>Step 1 of 6</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Order Review ({cartItems.length} items)
                </h2>
                <p className="text-xs text-slate-500">
                  Verify the selected items and quantities in your cart before continuing.
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

          {/* STEP 2: CUSTOMER INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <User className="w-4 h-4" />
                  <span>Step 2 of 6</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Customer Information
                </h2>
                <p className="text-xs text-slate-500">
                  Please provide your contact details for order tracking and receipts.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
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
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SHIPPING ADDRESS */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Step 3 of 6</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Shipping Address
                </h2>
                <p className="text-xs text-slate-500">
                  Where should we deliver your products?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace, Suite 101"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="e.g. Springfield"
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
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="e.g. Oregon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formErrors.state && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.state}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.pinCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pinCode: e.target.value })}
                    placeholder="e.g. 97477"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.pinCode && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.pinCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Step 4 of 6</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Payment Method
                </h2>
                <p className="text-xs text-slate-500">
                  Select a simulated payment method (no real payment gateway required).
                </p>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
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
                          Cash on Delivery
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Pay directly upon parcel arrival
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {paymentMethod === 'Cash on Delivery' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>

                {/* UPI */}
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
                          UPI
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Google Pay, PhonePe, Paytm (Simulated VPA)
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

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'Credit/Debit Card'
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
                          Credit/Debit Card
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Visa, MasterCard, Amex (Simulated)
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Credit/Debit Card' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {paymentMethod === 'Credit/Debit Card' && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {paymentMethod === 'Credit/Debit Card' && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">
                        Card Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={cardNumber}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL ORDER SUMMARY */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>Step 5 of 6</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Final Order Summary
                </h2>
                <p className="text-xs text-slate-500">
                  Verify products, quantities, discounts, and final calculated price.
                </p>
              </div>

              {/* Products and Quantity table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Products & Quantity
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-contain bg-white rounded-lg p-1 border" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                            {item.title}
                          </p>
                          <p className="text-slate-400 text-[11px]">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-{formatPrice(discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(tax, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping, currency)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-sm font-bold text-slate-900 dark:text-white">
                  <span>Final Amount:</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PLACE ORDER */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Lock className="w-4 h-4" />
                  <span>Step 6 of 6</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Confirm & Place Order
                </h2>
                <p className="text-xs text-slate-500">
                  Ready to place your order! Click the button below to confirm.
                </p>
              </div>

              {/* Confirmation Overview Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer</span>
                  <p className="font-bold text-slate-900 dark:text-white">{customerInfo.fullName}</p>
                  <p className="text-slate-500">{customerInfo.email}</p>
                  <p className="text-slate-500">{customerInfo.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Shipping Address</span>
                  <p className="font-bold text-slate-900 dark:text-white">{shippingAddress.address}</p>
                  <p className="text-slate-500">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}</p>
                  <p className="text-slate-500">Payment: <strong>{paymentMethod}</strong></p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Order Placement Ready</span>
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Total of {cartItems.length} product(s) for a final amount of <strong>{formatPrice(finalTotal, currency)}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Navigation & Action Buttons */}
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

            {currentStep < 6 ? (
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
                    <span>Place Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Order Total Summary Card */}
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
              <span className="font-bold text-slate-900 dark:text-white">Final Amount:</span>
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
