/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    sid: 0,
    name: '',
    token: '',
    login: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action) {
      if (action.payload.success) {
        const { sid, name, token } = action.payload.auth;
        state.profile = {
          sid,
          name,
          token,
          login: true,
        };
        localStorage.setItem('auth', JSON.stringify(action.payload.auth));
      }
    },
    setLogout(state) {
      state.profile = { ...initialState.profile };
      localStorage.removeItem('auth');
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;

export default userSlice.reducer;
