import * as Icon from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { selectToken } from "../login/login.slice";
import { useAppSelector } from "../../app/hooks";

function Nav() {
  const loginToken = useAppSelector(selectToken);
  function onLogout() {
    console.log('TODO: onLogout');
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
