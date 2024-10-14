import { resetLoginToInitialState, selectToken } from "../login/login.slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetBooksToInitialState } from "../books/booksSlice";
import Nav from "./Nav";

function NavContainer() {
  const loginToken = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  function onLogout() {
    dispatch(resetBooksToInitialState());
    dispatch(resetLoginToInitialState());
  }

  return <Nav
            onLogout={onLogout}
            isLoggedIn={!!loginToken} />
}

export default NavContainer;
