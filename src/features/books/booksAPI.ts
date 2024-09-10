import { Book, BookSort, InputBook } from "./Book";

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

export async function addBook(book: InputBook) {
  const url = process.env.REACT_APP_BOOKS_SERVER_URL;
  if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(book),
    headers: { 'content-type': 'application/json' },
  });
  
  if(response.ok) {
    const addedBook = await response.json();
    return addedBook;
  } else {
    throw new Error(`Couldn't add the book "${book.title}"`);
  }
}

export async function updateBook(book: Book) {
  if(!('id' in book)) throw new Error(`Couldn't update a book. "id" is missing.`);

  const msgEditFailed = `Couldn't edit a book with the id="${book.id}"`;
  const url = process.env.REACT_APP_BOOKS_SERVER_URL;

  if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL is not defined');

  const response = await fetch(`${url}/${book.id}`, {
    method: 'PUT',
    body: JSON.stringify(book),
    headers: { 'content-type': 'application/json' },
  });

  if(response.ok) {
    return book;
  } else {
    throw new Error(msgEditFailed);
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
