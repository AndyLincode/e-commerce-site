/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
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
      console.log(action.payload);
      if (action.payload.success) {
        const { sid, name, token } = action.payload.auth;
        console.log({ sid, name, token });
        state.profile = {
          sid,
          name,
          token,
          login: true,
        };
      }
    },
    setLogout(state) {
      state.profile = { ...initialState.profile };
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;

export default userSlice.reducer;
