import * as Icon from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { resetLoginToInitialState, selectToken } from "../login/login.slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetBooksToInitialState } from "../books/booksSlice";


function Nav() {
  const loginToken = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  function onLogout() {
    dispatch(resetBooksToInitialState());
    dispatch(resetLoginToInitialState());
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{flexGrow: 1}} />
        { !loginToken && <Link to="/login" style={{color: 'inherit'}}><Icon.Login /></Link> }
        { loginToken && <IconButton color="inherit" onClick={onLogout}><Icon.Logout /></IconButton> }
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
