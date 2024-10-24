import Nav from "./Nav";

function NavContainer() {
  function onLogout() {
    console.log('todo: logout')
  }

  return <Nav
            onLogout={onLogout}
            isLoggedIn={true} />
}

export default NavContainer;
