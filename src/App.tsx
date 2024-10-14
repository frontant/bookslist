import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import BooksApp from './features/books/BooksApp';
import FormDialog from './features/FormDialog/FormDialog.container';
import DeletionDialog from './features/books/DeletionDialog';
import NotFound from './NotFound';
import LoginForm from './features/login/LoginForm.container';
import Nav from './features/navMenu/Nav.container';
import { useAppSelector } from './app/hooks';
import { selectToken } from './features/login/login.slice';
import './i18n';

function App() {
  const loginToken = useAppSelector(selectToken);
  const { t } = useTranslation();

  return (
    <div className="App">
      <Nav />
      <div className='App-content'>
        <Routes>
          <Route path='/' element={loginToken ? <BooksApp /> : <p>{t('error.login-required')}</p>}>
            <Route path='/new' element={<FormDialog />} />
            <Route path='/edit/:id' element={<FormDialog />} />
            <Route path='/delete/:id' element={<DeletionDialog />} />
          </Route>
          <Route path='/login' element={<LoginForm />} />
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
