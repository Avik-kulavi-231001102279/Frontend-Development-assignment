import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchProductsByCategory,
} from '../src/features/products/productThunks';
import { placeOrder } from '../src/features/orders/orderThunks';
import { simulateLogin, simulateRegistration } from '../src/features/auth/authThunks';
import { api } from '../src/services/api';

describe('createAsyncThunk asynchronous operations', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchProducts returns fulfilled action with product payload', async () => {
    const mockData = [
      { id: 1, title: 'Item 1', price: 10 },
      { id: 2, title: 'Item 2', price: 20 },
    ];
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockData);

    const dispatch = vi.fn();
    const thunk = fetchProducts();
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('products/fetchProducts/fulfilled');
    expect(result.payload).toEqual(mockData);
  });

  it('fetchProductById returns fulfilled action for specific ID', async () => {
    const mockProduct = { id: 1, title: 'Foldsack Bag', price: 109.95 };
    vi.spyOn(api, 'getProductById').mockResolvedValue(mockProduct);

    const dispatch = vi.fn();
    const thunk = fetchProductById(1);
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('products/fetchProductById/fulfilled');
    expect(result.payload).toEqual(mockProduct);
  });

  it('fetchCategories returns array of categories', async () => {
    const mockCats = ['electronics', 'jewelery'];
    vi.spyOn(api, 'getCategories').mockResolvedValue(mockCats);

    const dispatch = vi.fn();
    const thunk = fetchCategories();
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('products/fetchCategories/fulfilled');
    expect(result.payload).toEqual(mockCats);
  });

  it('placeOrder generates unique Order ID, calls clearCart and returns confirmed order', async () => {
    const dispatch = vi.fn();
    const orderPayload = {
      items: [{ id: 1, title: 'Item 1', price: 100, quantity: 2 }],
      subtotal: 200,
      discount: 20,
      tax: 9,
      shipping: 0,
      totalAmount: 189,
      shippingAddress: { fullName: 'Alex Morgan' },
      paymentMethod: 'Credit / Debit Card',
    };

    const thunk = placeOrder(orderPayload);
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('orders/placeOrder/fulfilled');
    expect(result.payload.id).toMatch(/^ORD-\d{4}-\d+/);
    expect(result.payload.orderStatus).toBe('Confirmed');
    expect(result.payload.totalAmount).toBe(189);
    // Verified that clearCart action was dispatched
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'cart/clearCart' })
    );
  });

  it('simulateLogin authenticates valid demo credentials', async () => {
    const dispatch = vi.fn();
    const thunk = simulateLogin({
      email: 'demo@shopsphere.com',
      password: 'password123',
    });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('auth/simulateLogin/fulfilled');
    expect(result.payload.user.email).toBe('demo@shopsphere.com');
    expect(result.payload.token).toBeDefined();
  });

  it('simulateLogin rejects invalid password', async () => {
    const dispatch = vi.fn();
    const thunk = simulateLogin({
      email: 'demo@shopsphere.com',
      password: 'wrong_password',
    });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('auth/simulateLogin/rejected');
    expect(result.payload).toContain('Invalid password');
  });

  it('fetchProductsByCategory returns category and products', async () => {
    const mockCategoryData = [{ id: 10, title: 'USB Stick', category: 'electronics' }];
    vi.spyOn(api, 'getProductsByCategory').mockResolvedValue(mockCategoryData);

    const dispatch = vi.fn();
    const thunk = fetchProductsByCategory('electronics');
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('products/fetchProductsByCategory/fulfilled');
    expect(result.payload.category).toBe('electronics');
    expect(result.payload.products).toEqual(mockCategoryData);
  });

  it('fetchProducts handles failure and dispatches rejected action', async () => {
    vi.spyOn(api, 'getProducts').mockRejectedValue(new Error('Network Timeout'));

    const dispatch = vi.fn();
    const thunk = fetchProducts();
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('products/fetchProducts/rejected');
    expect(result.payload).toContain('Network Timeout');
  });

  it('simulateRegistration registers a new user with valid details', async () => {
    const dispatch = vi.fn();
    const thunk = simulateRegistration({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('auth/simulateRegistration/fulfilled');
    expect(result.payload.user.name).toBe('Jane Doe');
    expect(result.payload.user.email).toBe('jane@example.com');
  });

  it('simulateRegistration rejects when name is too short', async () => {
    const dispatch = vi.fn();
    const thunk = simulateRegistration({
      name: 'A',
      email: 'jane@example.com',
      password: 'password123',
    });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe('auth/simulateRegistration/rejected');
    expect(result.payload).toContain('at least 2 characters');
  });
});
