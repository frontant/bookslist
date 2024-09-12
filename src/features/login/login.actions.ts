import { createAsyncAction } from "typesafe-actions";
import { Login } from "./Login";
import { IFetchError } from "../../FetchError";

export const loginAction = createAsyncAction(
  'login/doLogin/pending',
  'login/doLogin/success',
  'login/doLogin/fulfilled'
)<Login, string, IFetchError>();
