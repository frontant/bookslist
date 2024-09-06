import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, InputBook } from "./Book";
import { RootState } from "../../app/store";
import { convertToFetchError, IFetchError } from "../../FetchError";
import { fetchBooks, findBook } from "./booksAPI";

export type BooksState = {
  books: Book[],
  booksLoadingState: null|'pending'|'completed'|'error',
  booksLoadingError: IFetchError|null,
}

const initialState:BooksState = {
  books: [],
  booksLoadingState: null,
  booksLoadingError: null,  
};

export const loadBooks = createAsyncThunk(
  'books/loadBooks',
  async(obj, { rejectWithValue }) => {
    try {
      const data = await fetchBooks();
      return data;
    } catch(error) {
      return rejectWithValue(convertToFetchError(error));
    }
  },
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    removeBook: (state, action: PayloadAction<string>) => {
      const bookIndex = state.books.findIndex(book => book.id === action.payload);
      state.books.splice(bookIndex, 1);
    },
    saveBook: (state, action:PayloadAction<InputBook>) => {
      const payloadId = 'id' in action.payload ? action.payload.id : '';
      const bookIndex = state.books.findIndex(book => book.id === payloadId);

      if(bookIndex > -1) {
        state.books[bookIndex] = action.payload as Book;
      } else {
        const nextId = state.books.reduce((ac, cur) => Math.max(ac, parseInt(cur.id)), 0) + 1;
        state.books.push({
          id: nextId.toString(),
          rating: 0,
          ...action.payload,
        })
      }
    },
  },
  extraReducers(builder) {
    builder
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
      });
  },
});

export const { saveBook, removeBook } = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.books;
export const selectBooksLoadingState = (state: RootState) => state.books.booksLoadingState;
export const selectBooksLoadingError = (state: RootState) => state.books.booksLoadingError;

export const selectBook = createSelector(
  [selectBooks],
  (books) => (id:string):Book|null => findBook(books, id)
);

export default booksSlice.reducer;
