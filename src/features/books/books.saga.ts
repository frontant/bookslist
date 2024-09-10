import { takeLatest, put } from 'redux-saga/effects';
import { Book } from "./Book";
import { loadBooksAction, removeBookAction, saveBookAction } from './books.actions';
import { convertToFetchError } from '../../FetchError';

function* loadBooks():Generator {
  try {
    const url = process.env.REACT_APP_BOOKS_SERVER_URL;

    if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');
    
    const response:Response = (yield fetch(url)) as Response;

    if(response.ok) {
      const data:Book[] = (yield response.json()) as Book[];
      yield put(loadBooksAction.success(data));
    } else {
      throw new Error(`Couldn't fetch books`);
    }
  } catch(error) {
    yield put(loadBooksAction.failure(convertToFetchError(error)));
  }
};

function* removeBook({ payload: id }: ReturnType<typeof removeBookAction.request>):Generator {
  try {
    const url = process.env.REACT_APP_BOOKS_SERVER_URL;

    if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');

    const response:Response = (yield fetch(`${url}/${id}`, {
      method: 'DELETE',
    })) as Response;

    if(response.ok) {
      yield put(removeBookAction.success(id));
    } else {
      throw new Error(`Couldn't delete the book with the id "${id}".`);
    }
  } catch(error) {
    yield put(removeBookAction.failure(convertToFetchError(error)));
  }
}

function* saveBook({payload:book}:ReturnType<typeof saveBookAction.request>):Generator {
  try {
    const url = process.env.REACT_APP_BOOKS_SERVER_URL;
    if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');

    const doUpdate = 'id' in book;
    const requestUrl =  doUpdate ? `${url}/${book.id}` : url;
    const requestMethod = doUpdate ? 'PUT' : 'POST'

    const response:Response = (yield fetch(requestUrl, {
      method: requestMethod,
      body: JSON.stringify(book),
      headers: { 'content-type': 'application/json' },
    })) as Response;
    
    if(response.ok) {
      const retBook = (yield response.json()) as Book;
      yield put(saveBookAction.success(retBook));
    } else {
      throw new Error(`Couldn't add the book "${book.title}"`);
    }
  } catch(error) {
    yield put(saveBookAction.failure(convertToFetchError(error)));
  }
}

export default function* booksSaga() {
  yield takeLatest(loadBooksAction.request, loadBooks);
  yield takeLatest(removeBookAction.request, removeBook);
  yield takeLatest(saveBookAction.request, saveBook);
}
