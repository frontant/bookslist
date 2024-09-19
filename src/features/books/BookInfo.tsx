import React from "react";
import { Book } from "./Book";
import styles from './BookInfo.module.scss';

type Props = {
  book: Book;
}

const BookInfo:React.FC<Props> = ({ book }) => {
  return (
    <div className={styles['book-info']}>
      <div className={styles.description}>
        {book.title}
        { book.release && <div>{book.release}</div> }
      </div>
      { book.price && <div>{book.price}</div> }
    </div>
  );
}

export default BookInfo;
