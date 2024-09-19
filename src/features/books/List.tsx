import React, { useEffect, useMemo, useState } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { Book, BookSort, BookSortIn } from "./Book";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBooks, selectBooksLoadingError, selectBooksLoadingState } from "./booksSlice";
import { filterBooks, sortBooks } from "./booksHelpers";
import ErrorMessage from "../../ErrorMessage";
import { loadBooksAction } from "./books.actions";
import { useTranslation } from "react-i18next";
import { useNavigateWithQuery } from "./customHooks";
import BookInfo from "./BookInfo";

type Props = {
  filterByTitle?: string,
}
const List:React.FC<Props> = ({ filterByTitle }) => {
  const [ sort, setSort ] = useState<BookSort>({
    orderBy: 'title',
    order: 'asc',
  });
  const navigate = useNavigateWithQuery();
  const books = useAppSelector(selectBooks);
  const booksLoadingState = useAppSelector(selectBooksLoadingState);
  const booksLoadingError = useAppSelector(selectBooksLoadingError);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const filteredBooks = useMemo<Book[]>(() =>
    sortBooks(
      filterByTitle ?
        filterBooks(books, filterByTitle) :
        books, sort),
    [sort, books, filterByTitle]);

  const tableHead = useMemo(() => ({
    title: t('book.title'),
    author: t('book.author'),
    isbn: t('book.isbn'),
    rating: t('book.rating'),
  }), [ t ]);

  useEffect(() => {
    dispatch(loadBooksAction.request());
  }, [dispatch]);
  
  function onDelete(book:Book) {
    navigate(`/delete/${book.id}`);
  }

  function onEdit(book:Book) {
    navigate(`/edit/${book.id}`);
  }

  return (
    <Paper>
      { booksLoadingState === 'error' && <ErrorMessage error={booksLoadingError}/> }
      <Table>
        <TableHead>
          <TableRow>
            {Object.entries(tableHead).map(([key, head]) => (
              <TableCell key={key}>
                {head}
                <TableSortLabel
                  active={sort.orderBy === head}
                  direction={sort.order}
                  onClick={() => {
                    setSort({
                      orderBy: key as BookSortIn,
                      order: sort.order === 'asc' ? 'desc' : 'asc'
                    });
                  }} />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBooks.map(book => (
            <TableRow key={book.id}>
              <TableCell><BookInfo book={book}/></TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{Array(5).fill(0).map((item, index) => book?.rating && index < book.rating ? <Star key={index} /> : <StarBorder key={index} />)}</TableCell>
              <TableCell>
                <IconButton aria-label="edit book" onClick={() => onEdit(book)}>
                  <Edit />
                </IconButton>
                <IconButton aria-label="delete book" onClick={() => onDelete(book)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default List;
