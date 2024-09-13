import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Book } from "./Book";
import { RootState } from "../../app/store";
import { IFetchError } from "../../FetchError";
import { findBook } from "./booksHelpers";
import { ActionType, getType } from "typesafe-actions";
import { loadBooksAction, removeBookAction, saveBookAction } from "./books.actions";
import { StateInfo } from "../../app/StateInfo";

export type BooksState = {
  books: Book[],
  booksLoadingState: StateInfo|null,
  booksLoadingError: IFetchError|null,
  bookRemoveState: StateInfo|null,
  bookRemoveError: IFetchError|null,
  bookSaveState: StateInfo|null,
  bookSaveError: IFetchError|null,
}

const initialState:BooksState = {
  books: [],
  booksLoadingState: null,
  booksLoadingError: null,  
  bookRemoveState: null,
  bookRemoveError: null,  
  bookSaveState: null,
  bookSaveError: null,
};

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    resetBooksLoadingState: (state) => {
      state.booksLoadingState = null;
      state.booksLoadingError = null;
    },
    resetBookRemoveState: (state) => {
      state.bookRemoveState = null;
      state.bookRemoveError = null;
    },
    resetBookSaveState: (state) => {
      state.bookSaveState = null;
      state.bookSaveError = null;
    },
    resetBooksToInitialState: (state) => {
      for(const [key, value] of Object.entries(initialState) as [keyof BooksState, any][]) {
        state[key] = value;
      }
    },
  },
  extraReducers(builder) {
    builder
      // loadBook
      .addCase(getType(loadBooksAction.request), (state) => {
        state.booksLoadingState = 'pending';
        state.booksLoadingError = null;
      })
      .addCase(
        getType(loadBooksAction.success),
        (state, action:ActionType<typeof loadBooksAction.success>) => {
        state.booksLoadingState = 'completed';
        state.books = action.payload;
        state.booksLoadingError = null;
      })
      .addCase(getType(loadBooksAction.failure), (state, action:ActionType<typeof loadBooksAction.failure>) => {
        state.booksLoadingState = 'error';
        state.booksLoadingError = action.payload;
      })
      
      // removeBook
      .addCase(getType(removeBookAction.request), (state) => {
        state.bookRemoveState = 'pending';
        state.bookRemoveError = null;
      })
      .addCase(getType(removeBookAction.success), (state, action:ActionType<typeof removeBookAction.success>) => {
        state.bookRemoveState = 'completed';
        const removedIndex = state.books.findIndex(book => book.id === action.payload);
        state.books.splice(removedIndex, 1);
        state.bookRemoveError = null;
      })
      .addCase(getType(removeBookAction.failure), (state, action:ActionType<typeof removeBookAction.failure>) => {
        state.bookRemoveState = 'error';
        state.bookRemoveError = action.payload;
      })
      
      // saveBook
      .addCase(getType(saveBookAction.request), (state) => {
        state.bookSaveState = 'pending';
        state.bookSaveError = null;
      })
      .addCase(getType(saveBookAction.success), (state, action: ActionType<typeof saveBookAction.success>) => {
        state.bookSaveState = 'completed';
        state.bookSaveError = null;
        const bookIndex = state.books.findIndex(book => book.id === action.payload.id);
        if(bookIndex > -1) {
          state.books[bookIndex] = action.payload;
        } else {
          state.books.push(action.payload);
        }
      })
      .addCase(getType(saveBookAction.failure), (state, action:ActionType<typeof saveBookAction.failure>) => {
        state.bookSaveState = 'error';
        state.bookSaveError = action.payload;
      });
  },
});

export const {
  resetBooksLoadingState,
  resetBookRemoveState,
  resetBookSaveState,
  resetBooksToInitialState,
} = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.books;
export const selectBooksLoadingState = (state: RootState) => state.books.booksLoadingState;
export const selectBooksLoadingError = (state: RootState) => state.books.booksLoadingError;
export const selectBookRemoveState = (state: RootState) => state.books.bookRemoveState;
export const selectBookRemoveError = (state: RootState) => state.books.bookRemoveError;
export const selectBookSaveState = (state: RootState) => state.books.bookSaveState;
export const selectBookSaveError = (state: RootState) => state.books.bookSaveError;

export const selectBook = createSelector(
  [selectBooks],
  (books) => (id:string):Book|null => findBook(books, id)
);

export default booksSlice.reducer;
