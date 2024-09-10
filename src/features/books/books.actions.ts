import { createAsyncAction } from "typesafe-actions";
import { Book } from "./Book";
import { IFetchError } from "../../FetchError";

export const loadBooksAction = createAsyncAction(
  'books/loadBooks/pending',
  'books/loadBooks/fulfilled',
  'book/loadBooks/rejected'
)<void, Book[], IFetchError>();
