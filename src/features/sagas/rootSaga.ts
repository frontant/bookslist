import { all } from 'redux-saga/effects';
import booksSaga from '../books/books.saga';

export default function* rootSaga() {
  yield all([
    booksSaga(),
  ]);
};
