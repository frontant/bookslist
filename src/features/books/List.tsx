import { useCallback, useEffect, useState } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { Book } from "./Book";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";

type SortIn = keyof Book;
type SortDirection = 'asc' | 'desc';

type Sort = {
  orderBy: SortIn,
  order: SortDirection,
}

const tableHead = {
  title: 'Title',
  author: 'Author',
  isbn: 'ISBN',
  rating: 'Bewertung',
};

function List() {
  const [ sort, setSort ] = useState<Sort>({
    orderBy: 'title',
    order: 'asc',
  });
  const [ sortedBooks, setSortedBooks ] = useState<Book[]>([]);
  const books = useAppSelector((state: RootState) => state.books);

  const doSort = useCallback(() => {
    setSortedBooks(curBooks => ([...curBooks].sort(
      (b1, b2) => {
        const res = b1[sort.orderBy].toString().localeCompare(b2[sort.orderBy].toString());
        return sort.order === 'asc' ? res : -res;
      })
    ));
  }, [sort]);

  useEffect(() => {
    setSortedBooks(books);
    doSort();
  }, [books, doSort]);
  
  function onDelete(book:Book) {
    console.log('TODO: onDelete()');
  }

  function onEdit(book:Book) {
    console.log('TODO: onEdit()');
  }

  return (
    <Paper>
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
                      orderBy: key as SortIn,
                      order: sort.order === 'asc' ? 'desc' : 'asc'
                    });
                  }} />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBooks.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{Array(5).fill(0).map((item, index) => index < book.rating ? <Star key={index} /> : <StarBorder key={index} />)}</TableCell>
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
