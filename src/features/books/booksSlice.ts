import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "./Book";
import booksData from "./books";
import { RootState } from "../../app/store";

export type BooksState = Book[];

export const booksSlice = createSlice({
  name: 'books',
  initialState: { books: booksData },
  reducers: {
    removeBook: (state, action: PayloadAction<string>) => {
      const bookIndex = state.books.findIndex(book => book.id === action.payload);
      state.books.splice(bookIndex, 1);
    },
  },
});

export const { removeBook } = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.books;

export default booksSlice.reducer;
