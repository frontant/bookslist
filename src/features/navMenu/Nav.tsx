import * as Icon from "@mui/icons-material";
import { AppBar, Box, IconButton, Menu, MenuItem, MenuList, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Nav.module.scss";

type Props = {
  onLogout: () => void,
  isLoggedIn: boolean,
}
const Nav:React.FC<Props> = ({ onLogout, isLoggedIn }) => {
  const [ anchorEl, setAnchorEl ] = useState<HTMLElement|null>(null);
  const open = Boolean(anchorEl);
  const { i18n } = useTranslation();

  function onMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function onMenuClose() {
    setAnchorEl(null);
  }

  function changeLanguage(lng: string) {
    i18n.changeLanguage(lng);
    onMenuClose();
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onMenuOpen}>
          <Icon.Language />
        </IconButton>
        <Menu
          className={styles['nav-menu']}
          open={open}
          anchorEl={anchorEl}
          onClose={onMenuClose}
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
        { !isLoggedIn && <Link to={'/login' + window.location.search} style={{color: 'inherit'}}><Icon.Login /></Link> }
        { isLoggedIn && <IconButton color="inherit" onClick={onLogout}><Icon.Logout /></IconButton> }
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
