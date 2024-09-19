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
        <div>{book.title}</div>
        <div className={styles.details}>
          {book.release && t('book.releaseValue', { release: book.release })}
          {book.release && book.pages && ', '}
          {book.pages && t('book.pagesValue', { pages: book.pages })}
        </div>
      </div>
      <div className={styles.price}>{book.price && t('book.priceValue', { price: book.price })}</div>
    </div>
  );
}

export default BookInfo;
