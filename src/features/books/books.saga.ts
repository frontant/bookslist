import { takeLatest, put } from 'redux-saga/effects';
import { Book } from "./Book";
import { loadBooksAction } from './books.actions';
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

export default function* booksSaga() {
  yield takeLatest(loadBooksAction.request, loadBooks);
}
