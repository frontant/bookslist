import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, InputBook } from "./Book";
import { RootState } from "../../app/store";
import { convertToFetchError, IFetchError } from "../../FetchError";
import * as BooksAPI from "./booksAPI";

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

export const loadBooks = createAsyncThunk(
  'books/loadBooks',
  async(obj, { rejectWithValue }) => {
    try {
      const data = await BooksAPI.fetchBooks();
      return data;
    } catch(error) {
      return rejectWithValue(convertToFetchError(error));
    }
  },
);

export const removeBook = createAsyncThunk(
  'books/removeBook',
  async(id: string, { rejectWithValue }) => {
    try {
      await BooksAPI.deleteBook(id);
      return id;
    } catch(error) {
      return rejectWithValue(convertToFetchError(error));
    }
  }
);

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
      .addCase(loadBooks.pending, (state) => {
        state.booksLoadingState = 'pending';
        state.booksLoadingError = null;
      })
      .addCase(loadBooks.fulfilled, (state, action:PayloadAction<Book[]>) => {
        state.booksLoadingState = 'completed';
        state.books = action.payload;
        state.booksLoadingError = null;
      })
      .addCase(loadBooks.rejected, (state, action) => { // TODO: set action type properly
        state.booksLoadingState = 'error';
        state.booksLoadingError = action.payload as IFetchError; // TODO: improve by setting action type properly
      })
      
      // removeBook
      .addCase(removeBook.pending, (state) => {
        state.bookRemoveState = 'pending';
        state.bookRemoveError = null;
      })
      .addCase(removeBook.fulfilled, (state, action:PayloadAction<string>) => {
        state.bookRemoveState = 'completed';
        const removedIndex = state.books.findIndex(book => book.id === action.payload);
        state.books.splice(removedIndex, 1);
        state.bookRemoveError = null;
      })
      .addCase(removeBook.rejected, (state, action) => { // TODO: set action type properly
        state.bookRemoveState = 'error';
        state.bookRemoveError = action.payload as IFetchError; // TODO: improve by setting action type properly
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
        console.log(action.payload as IFetchError);
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
