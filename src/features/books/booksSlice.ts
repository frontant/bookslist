import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, InputBook } from "./Book";
import { RootState } from "../../app/store";
import { convertToFetchError, IFetchError } from "../../FetchError";
import * as BooksAPI from "./booksAPI";
import { ActionType, getType } from "typesafe-actions";
import { loadBooksAction, removeBookAction } from "./books.actions";

type StateInfo = 'pending'|'completed'|'error';

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

export const saveBook = createAsyncThunk(
  'books/saveBook',
  async (book: InputBook, { rejectWithValue }) => {
    try {
      let retBook = null;

      if('id' in book) {
        retBook = await BooksAPI.updateBook(book as Book);
      } else {
        retBook = await BooksAPI.addBook(book);
      }

      return retBook;
    } catch(error) {
      return rejectWithValue(convertToFetchError(error));
    }
  });

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
    }
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
      
      // addBook
      .addCase(saveBook.pending, (state) => {
        state.bookSaveState = 'pending';
        state.bookSaveError = null;
      })
      .addCase(saveBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.bookSaveState = 'completed';
        state.bookSaveError = null;
        const bookIndex = state.books.findIndex(book => book.id === action.payload.id);
        if(bookIndex > -1) {
          state.books[bookIndex] = action.payload;
        } else {
          state.books.push(action.payload);
        }
      })
      .addCase(saveBook.rejected, (state, action) => { // TODO: set action type properly
        state.bookSaveState = 'error';
        state.bookSaveError = action.payload as IFetchError; // TODO: improve by setting action type properly
      });
  },
});

export const { resetBooksLoadingState, resetBookRemoveState, resetBookSaveState } = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.books;
export const selectBooksLoadingState = (state: RootState) => state.books.booksLoadingState;
export const selectBooksLoadingError = (state: RootState) => state.books.booksLoadingError;
export const selectBookRemoveState = (state: RootState) => state.books.bookRemoveState;
export const selectBookRemoveError = (state: RootState) => state.books.bookRemoveError;
export const selectBookSaveState = (state: RootState) => state.books.bookSaveState;
export const selectBookSaveError = (state: RootState) => state.books.bookSaveError;

export const selectBook = createSelector(
  [selectBooks],
  (books) => (id:string):Book|null => BooksAPI.findBook(books, id)
);

export default booksSlice.reducer;
