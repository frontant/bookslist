import React, { useMemo } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { Book, BookSort, BookSortIn } from "../books/Book";
import ErrorMessage from "../../ErrorMessage";
import { IFetchError } from "../../FetchError";
import { useTranslation } from "react-i18next";
import BookInfo from "../books/BookInfo";

type Props = {
  books: Book[],
  sort: BookSort|null,
  error?: IFetchError,
  onSort: (sort:BookSort) => void,
  onDelete: (book:Book) => void,
  onEdit: (book:Book) => void,
}
const BooksList:React.FC<Props> = ({ books, sort, error, onSort, onDelete, onEdit }) => {
  const { t } = useTranslation();

  const tableHead = useMemo(() => ({
    title: t('book.title'),
    author: t('book.author'),
    isbn: t('book.isbn'),
    rating: t('book.rating'),
  }), [ t ]);

  return (
    <Paper>
      { error && <ErrorMessage error={error}/> }
      <Table>
        <TableHead>
          <TableRow>
            {Object.entries(tableHead).map(([key, head]) => (
              <TableCell key={key}>
                {head}
                <TableSortLabel
                  active={!!sort && sort.orderBy === head}
                  direction={sort ? sort.order : undefined}
                  onClick={() => onSort({
                      orderBy: key as BookSortIn,
                      order: sort && sort.order === 'asc' ? 'desc' : 'asc'
                    })
                  } />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map(book => (
            <TableRow key={book.id}>
              <TableCell><BookInfo book={book}/></TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{Array(5).fill(0).map((item, index) => book?.rating && index < book.rating ? <Star key={index} /> : book?.rating ? <StarBorder key={index} /> : '')}</TableCell>
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

export default BooksList;
