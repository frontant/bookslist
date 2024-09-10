import { takeLatest, put } from 'redux-saga/effects';
import { Book } from "./Book";
import { loadBooksAction, removeBookAction } from './books.actions';
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

export default function* booksSaga() {
  yield takeLatest(loadBooksAction.request, loadBooks);
  yield takeLatest(removeBookAction.request, removeBook);
}
