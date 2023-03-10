import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

if (localStorage.getItem('cart') && initialState.cart.length === 0) {
  const storage = JSON.parse(localStorage.getItem('cart'));
  initialState.cart.push(...storage);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart(state, action) {
      if (action.payload.amount > 0) {
        // eslint-disable-next-line object-curly-newline
        const { sid, name, img, price, amount } = action.payload;
        const index = state.cart.findIndex((e) => e.sid === sid);
        if (index >= 0) {
          // eslint-disable-next-line no-param-reassign
          state.cart[index].amount += amount;
        } else {
          state.cart.push({
            sid,
            name,
            img,
            price,
            amount,
          });
        }
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    reduceCart(state, action) {
      const { sid } = action.payload;
      const index = state.cart.findIndex((e) => e.sid === sid);
      if (index >= 0) {
        if (state.cart[index].amount > 1) {
          // eslint-disable-next-line no-param-reassign
          state.cart[index].amount -= 1;
          localStorage.setItem('cart', JSON.stringify(state.cart));
        } else {
          const cart1 = state.cart.slice(0, index);
          const cart2 = state.cart.slice(index + 1);
          const newCartItem = cart1.concat(cart2);
          // eslint-disable-next-line no-param-reassign
          state.cart = newCartItem;
          localStorage.setItem('cart', JSON.stringify(newCartItem));
        }
      }
    },
    removeItem(state, action) {
      const { sid } = action.payload;
      const index = state.cart.findIndex((e) => e.sid === sid);
      if (index >= 0) {
        const cart1 = state.cart.slice(0, index);
        const cart2 = state.cart.slice(index + 1);
        const newCartItem = cart1.concat(cart2);
        // eslint-disable-next-line no-param-reassign
        state.cart = newCartItem;
        localStorage.setItem('cart', JSON.stringify(newCartItem));
      } else {
        // eslint-disable-next-line no-alert
        alert('??????????????????');
      }
    },
    clearItem(state) {
      state.cart = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addCart, reduceCart, removeItem, clearItem } = cartSlice.actions;

export default cartSlice.reducer;
