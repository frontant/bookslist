export type Book = {
  id: string,
  title: string,
  author?: string,
  isbn?: string,
  rating?: number,
  release?: number,
  price?: number,
  pages?: number,
};

export type InputBook = Omit<Book, 'id'> & { id?: string };

export type BookSortIn = keyof Book;
export type BookSortDirection = 'asc' | 'desc';

export type BookSort = {
  orderBy: BookSortIn,
  order: BookSortDirection,
}

