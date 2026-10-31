import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTax,
  selectCartShipping,
  selectCartFinalTotal,
  selectAppliedCoupon,
  selectCouponError,
} from '../features/cart/cartSelectors';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  clearCouponError,
} from '../features/cart/cartSlice';

/**
 * Convenient Cart Hook encapsulating state and actions
 */
export const useCart = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const tax = useSelector(selectCartTax);
  const shipping = useSelector(selectCartShipping);
  const finalTotal = useSelector(selectCartFinalTotal);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const couponError = useSelector(selectCouponError);

  return {
    items,
    itemCount,
    subtotal,
    discount,
    tax,
    shipping,
    finalTotal,
    appliedCoupon,
    couponError,
    addItem: (product, quantity) => dispatch(addToCart({ product, quantity })),
    removeItem: (id) => dispatch(removeFromCart(id)),
    updateItemQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    incrementItem: (id) => dispatch(increaseQuantity(id)),
    decrementItem: (id) => dispatch(decreaseQuantity(id)),
    emptyCart: () => dispatch(clearCart()),
    addPromoCoupon: (code) => dispatch(applyCoupon(code)),
    deletePromoCoupon: () => dispatch(removeCoupon()),
    resetCouponError: () => dispatch(clearCouponError()),
  };
};

export default useCart;
