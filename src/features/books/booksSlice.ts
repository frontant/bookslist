import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, InputBook } from "./Book";
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
});

export const { saveBook, removeBook } = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.books;

export const selectBook = createSelector(
  [selectBooks],
  (books) => (id:string):Book|null => {
  return books.find(book => book.id === id) || null;
});

export default booksSlice.reducer;
