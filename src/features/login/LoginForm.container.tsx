import { useCallback, useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { useNavigateWithQuery } from "../books/customHooks";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetLoginState, selectLoginError, selectLoginState } from "./login.slice";
import { Login } from "./Login";
import { loginAction } from "./login.actions";

function LoginContainer() {
  const [ open, setOpen ] = useState(false);
  const loginState = useAppSelector(selectLoginState);
  const loginError = useAppSelector(selectLoginError);
  const navigate = useNavigateWithQuery();
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(resetLoginState());
    setOpen(false);
    navigate('/');
  }, [navigate, dispatch]);

  function onLogin(login:Login) {
    dispatch(loginAction.request(login));
  }

  useEffect(() => {
    if(loginState === 'completed') {
      onClose();
    } else {
      setOpen(true);
    }
  }, [loginState, onClose]);

  return <LoginForm
            onLogin={onLogin}
            onClose={onClose}
            open={open}
            error={loginState === 'error' ? loginError! : undefined}/>
}

export default LoginContainer;
