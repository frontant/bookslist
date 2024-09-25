import { combineEpics, Epic, ofType } from "redux-observable";
import { loadBooksAction, removeBookAction, saveBookAction } from "./books.actions";
import { catchError, from, map, of, switchMap } from "rxjs";
import { Book } from "./Book";
import { convertToFetchError, FetchError } from "../../FetchError";
import { selectToken } from "../login/login.slice";

const loadBooks:Epic = (action$, state$) =>
  action$.pipe(
    ofType(loadBooksAction.request),
    switchMap(() => 
      from((async () => {
        const url = process.env.REACT_APP_BACKEND_BOOKS_URL;
      
        if(!url) {
          throw new FetchError("fetch.error.env-var-undefined", { var: "REACT_APP_BACKEND_BOOKS_URL" });
        }
        
        const response = await fetch(url, {
          headers: { 'authorization': `Bearer ${selectToken(state$.value)}` }
        });
      
        if(response.ok) {
          return await response.json();
        } else {
          throw new FetchError('fetch.error.fetch-books-failed');
        }
      })()).pipe(
        map((data => loadBooksAction.success(data as Book[]))),
        catchError((error) => of(loadBooksAction.failure(convertToFetchError(error)))),
      )
    )
  );

const removeBook:Epic = (action$, state$) => 
  action$.pipe(
    ofType(removeBookAction.request),
    switchMap(({ payload: id }) =>
      from((async () => {
        const url = process.env.REACT_APP_BACKEND_BOOKS_URL;

        if(!url) {
          throw new FetchError("fetch.error.env-var-undefined", { var: "REACT_APP_BACKEND_BOOKS_URL" });
        }
    
        const response = await fetch(`${url}/${id}`, {
          method: 'DELETE',
          headers: { 'authorization': `Bearer ${selectToken(state$.value)}` }
        });
    
        if(response.ok) {
          return id;
        } else {
          throw new FetchError('fetch.error.deletion-failed', { id });
        }
      })()).pipe(
        map((data) => removeBookAction.success(data)),
        catchError((error) => of(removeBookAction.failure(convertToFetchError(error))))
      )
    )
  );

const saveBook:Epic = (action$, state$) =>
  action$.pipe(
    ofType(saveBookAction.request),
    switchMap(({payload: book}) =>
      from((async () => {
        const url = process.env.REACT_APP_BACKEND_BOOKS_URL;

        if(!url) {
          throw new FetchError("fetch.error.env-var-undefined", { var: "REACT_APP_BACKEND_BOOKS_URL" });
        }

        const doUpdate = 'id' in book;
        const requestUrl =  doUpdate ? `${url}/${book.id}` : url;
        const requestMethod = doUpdate ? 'PUT' : 'POST';

        const response = await fetch(requestUrl, {
          method: requestMethod,
          body: JSON.stringify(book),
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${selectToken(state$.value)}`,
          },
        });
        
        if(response.ok) {
          return await response.json();
        } else {
          if(doUpdate) {
            throw new FetchError('fetch.error.update-book-failed', { title: book.title });
          } else {
            throw new FetchError('fetch.error.add-book-failed', { title: book.title });
          }
        }
      })()).pipe(
        map((data) => saveBookAction.success(data)),
        catchError((error) => of(saveBookAction.failure(convertToFetchError(error))))
      ))
  );

// const trackActions:Epic = (action$) =>
//   action$.pipe(
//     filter((data) => data.type !== 'stop'),
//     tap((data) => console.log(data)),
//     map(() => ({ type: 'stop' })),
//   );
  
export default combineEpics(loadBooks, removeBook, saveBook);
