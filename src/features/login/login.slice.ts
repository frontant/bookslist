import { createSlice } from "@reduxjs/toolkit";
import { IFetchError } from "../../FetchError";
import { loginAction } from "./login.actions";
import { ActionType, getType } from "typesafe-actions";
import { StateInfo } from "../../app/StateInfo";
import { RootState } from "../../app/store";

export type LoginState = {
  token: string|null,
  loginState: StateInfo|null,
  loginError: IFetchError|null,
}

const initialState:LoginState = {
  token: null,
  loginState: null,
  loginError: null,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.loginState = null;
      state.loginError = null;
    },
    resetLoginToInitialState: (state) => {
      for(const [key, value] of Object.entries(initialState) as [keyof LoginState, any][]) {
        state[key] = value;
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getType(loginAction.request), (state) => {
        state.loginState = 'pending';
        state.loginError = null;
      })
      .addCase(getType(loginAction.success), (state, action:ActionType<typeof loginAction.success>) => {
        state.loginState = 'completed';
        state.loginError = null;
        state.token = action.payload;
      })
      .addCase(getType(loginAction.failure), (state, action:ActionType<typeof loginAction.failure>) => {
        state.loginState = 'error';
        state.loginError = action.payload;
      })
  }
});

export const { resetLoginState, resetLoginToInitialState } = loginSlice.actions;

export const selectToken = (state:RootState) => state.login.token;
export const selectLoginState = (state:RootState) => state.login.loginState;
export const selectLoginError = (state:RootState) => state.login.loginError;

export default loginSlice.reducer;
