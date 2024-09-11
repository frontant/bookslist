import { combineEpics } from "redux-observable";
import booksEpic from "./books.epic";

export default combineEpics(booksEpic);
