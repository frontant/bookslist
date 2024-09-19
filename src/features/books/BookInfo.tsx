import React from "react";
import { Book } from "./Book";
import styles from './BookInfo.module.scss';
import { useTranslation } from "react-i18next";

type Props = {
  book: Book;
}

const BookInfo:React.FC<Props> = ({ book }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['book-info']}>
      <div className={styles.description}>
        {book.title}
        <div>{book.release}, {t('book.pagesValue', { pages: book.pages })}</div>
      </div>
      { book.price && <div>{book.price}</div> }
    </div>
  );
}

export default BookInfo;
