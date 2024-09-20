import * as Icon from "@mui/icons-material";
import { AppBar, Box, IconButton, Menu, MenuItem, MenuList, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resetLoginToInitialState, selectToken } from "../login/login.slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetBooksToInitialState } from "../books/booksSlice";
import styles from "./Nav.module.scss";

function Nav() {
  const loginToken = useAppSelector(selectToken);
  const dispatch = useAppDispatch();
  const [ anchorEl, setAnchorEl ] = useState<HTMLElement|null>(null);
  const open = Boolean(anchorEl);
  const { i18n } = useTranslation();

  function onLogout() {
    dispatch(resetBooksToInitialState());
    dispatch(resetLoginToInitialState());
  }

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function changeLanguage(lng: string) {
    i18n.changeLanguage(lng);
    handleMenuClose();
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}>
          <Icon.Language />
        </IconButton>
        <Menu
          className={styles['nav-menu']}
          open={open}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          keepMounted>
          <MenuList disablePadding>
            <MenuItem dense disableGutters>
              <Link to='?lng=de' onClick={() => changeLanguage('de')}>DE</Link>
            </MenuItem>
            <MenuItem dense disableGutters>
              <Link to='?lng=en' onClick={() => changeLanguage('en')}>EN</Link>
            </MenuItem>
          </MenuList>
        </Menu>
        <Box sx={{flexGrow: 1}} />
        { !loginToken && <Link to={'/login' + window.location.search} style={{color: 'inherit'}}><Icon.Login /></Link> }
        { loginToken && <IconButton color="inherit" onClick={onLogout}><Icon.Logout /></IconButton> }
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
