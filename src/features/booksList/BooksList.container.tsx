import React, { useMemo, useState } from "react";
import { Book, BookSort } from "../books/Book";
import { filterBooks, sortBooks } from "../books/booksHelpers";
import { useNavigateWithQuery } from "../books/customHooks";
import BooksList from "./BooksList";
import { fetchBooks } from "../books/booksAPI";
import { useQuery } from "@tanstack/react-query";
import { convertToFetchError } from "../../FetchError";

type Props = {
  filterByTitle?: string,
}
const BooksListContainer:React.FC<Props> = ({ filterByTitle }) => {
  const [ sort, setSort ] = useState<BookSort|null>({
    orderBy: 'title',
    order: 'asc',
  });;
  const navigate = useNavigateWithQuery();
  const { data: books, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  const filteredBooks = useMemo<Book[]>(() => {
    if(!books) {
      return [];
    }

    const filteredBooks = filterByTitle ? filterBooks(books, filterByTitle) : books;
    const sortedBooks = sort ? sortBooks(filteredBooks, sort) : filteredBooks;
    return sortedBooks;
  }, [sort, books, filterByTitle]);

  function onDelete(book:Book) {
    navigate(`/delete/${book.id}`);
  }

  function onEdit(book:Book) {
    navigate(`/edit/${book.id}`);
  }

  return <BooksList
            books={filteredBooks}
            sort={sort}
            error={error ? convertToFetchError(error) : undefined}
            onSort={setSort}
            onDelete={onDelete}
            onEdit={onEdit}/>
}

export default BooksListContainer;
