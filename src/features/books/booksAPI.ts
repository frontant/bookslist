import { Book, BookSort } from "./Book";

export async function fetchBooks() {
  const url = process.env.REACT_APP_BOOKS_SERVER_URL;

  if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');
  
  const response = await fetch(url);

  if(response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Couldn't fetch books`);
  }
};

export async function deleteBook(id: string) {
  const url = process.env.REACT_APP_BOOKS_SERVER_URL;

  if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');

  const response = await fetch(`${url}/${id}`, {
    method: 'DELETE',
  });

  if(!response.ok) {
    throw new Error(`Couldn't delete the book with the id "${id}".`);
  }
}

export function sortBooks(books:Book[], sortParams: BookSort) {
  return books.toSorted((b1, b2) => {
    const res = b1[sortParams.orderBy].toString().localeCompare(b2[sortParams.orderBy].toString());
    return sortParams.order === 'asc' ? res : -res;
  });
};

export function findBook(books: Book[], id:string):Book|null {
  return books.find(book => book.id === id) || null;
};
