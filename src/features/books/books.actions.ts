import { createAsyncAction } from "typesafe-actions";
import { Book, InputBook } from "./Book";
import { IFetchError } from "../../FetchError";

export const loadBooksAction = createAsyncAction(
  'books/loadBooks/pending',
  'books/loadBooks/fulfilled',
  'book/loadBooks/rejected'
)<void, Book[], IFetchError>();

export const removeBookAction = createAsyncAction(
  'books/removeBook/pending',
  'books/removeBook/fulfilled',
  'books/removeBook/rejected',
)<string, string, IFetchError>();

export const saveBookAction = createAsyncAction(
  'books/saveBook/pending',
  'books/saveBook/fulfilled',
  'books/saveBook/rejected',
)<InputBook, Book, IFetchError>();
