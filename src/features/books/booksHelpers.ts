import { Book, BookSort } from "./Book";

export function sortBooks(books:Book[], sortParams: BookSort) {
  return books.toSorted((b1, b2) => {
    const res = b1[sortParams.orderBy]!.toString().localeCompare(b2[sortParams.orderBy]!.toString());
    return sortParams.order === 'asc' ? res : -res;
  });
};

export function findBook(books: Book[], id:string):Book|null {
  return books.find(book => book.id === id) || null;
};

export function filterBooks(books: Book[], filterText: string) {
  return books.filter(b => b.title.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()));
}
