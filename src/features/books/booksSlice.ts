import { createSlice } from "@reduxjs/toolkit";
import { Book } from "./Book";
import booksData from "./books";

export type BooksState = Book[];

export const booksSlice = createSlice({
  name: 'books',
  initialState: booksData,
  reducers: {}
});

export default booksSlice.reducer;
