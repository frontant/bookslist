import { combineEpics, Epic, ofType } from "redux-observable";
import { loginAction } from "./login.actions";
import { catchError, from, map, of, switchMap } from "rxjs";
import { convertToFetchError } from "../../FetchError";

const doLogin:Epic = (action$) =>
  action$.pipe(
    ofType(loginAction.request),
    switchMap(({ payload: credentials }) =>
      from((async() => {
        const url = process.env.REACT_APP_BACKEND_URL;

        if(!url) {
          throw new Error('REACT_APP_BACKEND_URL undefined');
        }

        const response = await fetch(`${url}/login`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if(response.ok) {
          return response.text();
        } else {
          throw new Error(`Couldn't login`);
        }
      })()).pipe(
        map((data) => loginAction.success(data)),
        catchError((error) => of(loginAction.failure(convertToFetchError(error))))
      )
    )
  );

export default combineEpics(doLogin);
