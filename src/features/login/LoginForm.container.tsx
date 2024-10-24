import { useCallback, useState } from "react";
import LoginForm from "./LoginForm";
import { useNavigateWithQuery } from "../books/customHooks";
import { Login } from "./Login";
import { IFetchError } from "../../FetchError";

function LoginContainer() {
  const [ open, setOpen ] = useState(false);
  const navigate = useNavigateWithQuery();
  const [ error, setError ] = useState<IFetchError|null>(null);

  const onClose = useCallback(() => {
    setError(null);
    setOpen(false);
    navigate('/');
  }, [navigate]);

  function onLogin(login:Login) {
    console.log('todo: do login');
  }

  return <LoginForm
            onLogin={onLogin}
            onClose={onClose}
            open={open}
            error={error || undefined}/>
}

export default LoginContainer;
