import React, { useEffect, useMemo, useState } from "react";
import { Book, BookSort } from "../books/Book";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBooks, selectBooksLoadingError, selectBooksLoadingState } from "../books/booksSlice";
import { filterBooks, sortBooks } from "../books/booksHelpers";
import { loadBooksAction } from "../books/books.actions";
import { useNavigateWithQuery } from "../books/customHooks";
import BooksList from "./BooksList";

type Props = {
  filterByTitle?: string,
}
const BooksListContainer:React.FC<Props> = ({ filterByTitle }) => {
  const [ sort, setSort ] = useState<BookSort|null>({
    orderBy: 'title',
    order: 'asc',
  });;
  const navigate = useNavigateWithQuery();
  const books = useAppSelector(selectBooks);
  const booksLoadingState = useAppSelector(selectBooksLoadingState);
  const booksLoadingError = useAppSelector(selectBooksLoadingError);
  const dispatch = useAppDispatch();

  const filteredBooks = useMemo<Book[]>(() => {
    const filteredBooks = filterByTitle ? filterBooks(books, filterByTitle) : books;
    const sortedBooks = sort ? sortBooks(filteredBooks, sort) : filteredBooks;
    return sortedBooks;
  }, [sort, books, filterByTitle]);

  useEffect(() => {
    dispatch(loadBooksAction.request());
  }, [dispatch]);
  
  function onDelete(book:Book) {
    navigate(`/delete/${book.id}`);
  }

  function onEdit(book:Book) {
    navigate(`/edit/${book.id}`);
  }

  return <BooksList
            books={filteredBooks}
            sort={sort}
            error={booksLoadingState === 'error' ? booksLoadingError! : undefined}
            onSort={setSort}
            onDelete={onDelete}
            onEdit={onEdit}/>
}

export default BooksListContainer;
