import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart(state, action) {
      if (action.payload.amount > 0) {
        // eslint-disable-next-line object-curly-newline
        const { sid, name, price, amount } = action.payload;
        const index = state.cart.findIndex((e) => e.sid === sid);
        if (index >= 0) {
          // eslint-disable-next-line no-param-reassign
          state.cart[index].amount += amount;
        } else {
          state.cart.push({
            sid,
            name,
            price,
            amount,
          });
        }
      }
    },
  },
});

export const { addCart } = cartSlice.actions;

export default cartSlice.reducer;
