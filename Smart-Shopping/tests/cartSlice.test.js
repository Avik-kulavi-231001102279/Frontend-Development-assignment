import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../src/features/cart/cartSlice';

describe('cartSlice reducer', () => {
  const initialTestState = {
    items: [],
    appliedCoupon: null,
    couponError: null,
  };

  const sampleProduct = {
    id: 1,
    title: 'Test Backpack',
    price: 100,
    image: 'https://example.com/bag.jpg',
    category: "men's clothing",
  };

  it('should return the initial state', () => {
    const state = cartReducer(undefined, { type: 'unknown' });
    expect(Array.isArray(state.items)).toBe(true);
  });

  it('should add a new product to cart', () => {
    const nextState = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 1 })
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe(1);
    expect(nextState.items[0].quantity).toBe(1);
    expect(nextState.items[0].price).toBe(100);
  });

  it('should prevent duplicates by increasing quantity if product already exists', () => {
    const stateWithOne = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 1 })
    );

    const stateWithTwo = cartReducer(
      stateWithOne,
      addToCart({ product: sampleProduct, quantity: 2 })
    );

    expect(stateWithTwo.items).toHaveLength(1);
    expect(stateWithTwo.items[0].quantity).toBe(3);
  });

  it('should remove product from cart by id', () => {
    const stateWithOne = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 2 })
    );

    const nextState = cartReducer(stateWithOne, removeFromCart(1));
    expect(nextState.items).toHaveLength(0);
  });

  it('should update product quantity and ignore invalid numbers', () => {
    const stateWithOne = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 1 })
    );

    const updatedState = cartReducer(
      stateWithOne,
      updateQuantity({ id: 1, quantity: 5 })
    );
    expect(updatedState.items[0].quantity).toBe(5);

    // Invalid negative or 0 quantity should be ignored
    const invalidState = cartReducer(
      updatedState,
      updateQuantity({ id: 1, quantity: -2 })
    );
    expect(invalidState.items[0].quantity).toBe(5);
  });

  it('should increase quantity with increaseQuantity action', () => {
    const stateWithOne = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 2 })
    );

    const state = cartReducer(stateWithOne, increaseQuantity(1));
    expect(state.items[0].quantity).toBe(3);
  });

  it('should decrease quantity or remove if quantity reaches 0', () => {
    const stateWithTwo = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 2 })
    );

    const stateWithOne = cartReducer(stateWithTwo, decreaseQuantity(1));
    expect(stateWithOne.items[0].quantity).toBe(1);

    const stateWithZero = cartReducer(stateWithOne, decreaseQuantity(1));
    expect(stateWithZero.items).toHaveLength(0);
  });

  it('should clear cart and coupon data', () => {
    let state = cartReducer(
      initialTestState,
      addToCart({ product: sampleProduct, quantity: 3 })
    );
    state = cartReducer(state, applyCoupon('WELCOME10'));
    expect(state.items).toHaveLength(1);
    expect(state.appliedCoupon).not.toBeNull();

    const clearedState = cartReducer(state, clearCart());
    expect(clearedState.items).toHaveLength(0);
    expect(clearedState.appliedCoupon).toBeNull();
  });

  it('should apply valid coupon and reject invalid coupon', () => {
    const stateValid = cartReducer(initialTestState, applyCoupon('WELCOME10'));
    expect(stateValid.appliedCoupon).not.toBeNull();
    expect(stateValid.appliedCoupon.code).toBe('WELCOME10');
    expect(stateValid.couponError).toBeNull();

    const stateInvalid = cartReducer(initialTestState, applyCoupon('INVALIDCODE99'));
    expect(stateInvalid.appliedCoupon).toBeNull();
    expect(stateInvalid.couponError).toContain('invalid');
  });

  it('should remove applied coupon', () => {
    let state = cartReducer(initialTestState, applyCoupon('WELCOME10'));
    expect(state.appliedCoupon).not.toBeNull();

    state = cartReducer(state, removeCoupon());
    expect(state.appliedCoupon).toBeNull();
  });
});
