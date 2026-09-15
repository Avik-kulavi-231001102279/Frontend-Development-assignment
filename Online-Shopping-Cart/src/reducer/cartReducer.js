// Initial state loading from LocalStorage
const loadState = () => {
  try {
    const savedState = localStorage.getItem('shopping_cart_state');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load state from LocalStorage', error);
  }
  return null;
};

export const initialState = loadState() || {
  cartItems: [],
  wishlist: [],
  discountPercentage: 0,
  couponCode: null,
  theme: 'dark', // Default theme
};

export const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        newState = { ...state, cartItems: updatedCart };
      } else {
        newState = {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }
      break;
    }

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
      break;

    case 'INCREASE_QUANTITY':
      newState = {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
      break;

    case 'DECREASE_QUANTITY':
      newState = {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
      break;

    case 'APPLY_COUPON': {
      const { code } = action.payload;
      let discount = 0;
      let appliedCode = null;

      // Mock coupon logic
      if (code === 'SAVE10') {
        discount = 10;
        appliedCode = code;
      } else if (code === 'SAVE20') {
        discount = 20;
        appliedCode = code;
      } else if (code === 'SAVE30') {
        discount = 30;
        appliedCode = code;
      }

      newState = {
        ...state,
        discountPercentage: discount,
        couponCode: appliedCode,
      };
      break;
    }

    case 'REMOVE_COUPON':
      newState = {
        ...state,
        discountPercentage: 0,
        couponCode: null,
      };
      break;

    case 'CLEAR_CART':
      newState = {
        ...state,
        cartItems: [],
        discountPercentage: 0,
        couponCode: null,
      };
      break;

    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.some(item => item.id === action.payload.id);
      if (exists) {
        newState = {
          ...state,
          wishlist: state.wishlist.filter(item => item.id !== action.payload.id)
        };
      } else {
        newState = {
          ...state,
          wishlist: [...state.wishlist, action.payload]
        };
      }
      break;
    }

    case 'SET_THEME':
      newState = {
        ...state,
        theme: action.payload,
      };
      break;

    default:
      return state;
  }

  // Save to LocalStorage whenever state changes
  try {
    localStorage.setItem('shopping_cart_state', JSON.stringify(newState));
  } catch (error) {
    console.error('Failed to save state to LocalStorage', error);
  }

  return newState;
};
