import { combineEpics, Epic, ofType } from "redux-observable";
import { loadBooksAction, removeBookAction, saveBookAction } from "./books.actions";
import { catchError, from, map, of, switchMap } from "rxjs";
import { Book } from "./Book";
import { convertToFetchError } from "../../FetchError";

const loadBooks:Epic = (action$) =>
  action$.pipe(
    ofType(loadBooksAction.request),
    switchMap(() => 
      from((async () => {
        const url = process.env.REACT_APP_BOOKS_SERVER_URL;
      
        if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');
        
        const response = await fetch(url);
      
        if(response.ok) {
          return await response.json();
        } else {
          throw new Error(`Couldn't fetch books`);
        }
      })()).pipe(
        map((data => loadBooksAction.success(data as Book[]))),
        catchError((error) => of(loadBooksAction.failure(convertToFetchError(error)))),
      )
    )
  );

const removeBook:Epic = (action$) => 
  action$.pipe(
    ofType(removeBookAction.request),
    switchMap(({ payload: id }) =>
      from((async () => {
        const url = process.env.REACT_APP_BOOKS_SERVER_URL;

        if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');
    
        const response = await fetch(`${url}/${id}`, {
          method: 'DELETE',
        });
    
        if(response.ok) {
          return id;
        } else {
          throw new Error(`Couldn't delete the book with the id "${id}".`);
        }
      })()).pipe(
        map((data) => removeBookAction.success(data)),
        catchError((error) => of(removeBookAction.failure(convertToFetchError(error))))
      )
    )
  );

const saveBook:Epic = (action$) =>
  action$.pipe(
    ofType(saveBookAction.request),
    switchMap(({payload: book}) =>
      from((async () => {
        const url = process.env.REACT_APP_BOOKS_SERVER_URL;
        if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');
    
        const doUpdate = 'id' in book;
        const requestUrl =  doUpdate ? `${url}/${book.id}` : url;
        const requestMethod = doUpdate ? 'PUT' : 'POST';

        const response = await fetch(requestUrl, {
          method: requestMethod,
          body: JSON.stringify(book),
          headers: { 'content-type': 'application/json' },
        });
        
        if(response.ok) {
          return response.json();
        } else {
          throw new Error(`Couldn't add the book "${book.title}"`);
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