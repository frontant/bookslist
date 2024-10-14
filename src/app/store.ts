import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import booksReducer from '../features/books/booksSlice';
import loginReducer from '../features/login/login.slice';
import rootEpic from './rootEpic';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    books: booksReducer,
    login: loginReducer,
  },
  devTools: true,
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), epicMiddleware];
  }
});

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
