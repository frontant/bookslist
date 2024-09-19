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
        <div className={styles.details}>{t('book.releaseValue', { release: book.release })}, {t('book.pagesValue', { pages: book.pages })}</div>
      </div>
      <div className={styles.price}>{t('book.priceValue', { price: book.price })}</div>
    </div>
  );
}

export default BookInfo;
