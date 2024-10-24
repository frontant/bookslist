import { Route, Routes } from 'react-router-dom';
import './App.css';
import BooksApp from './features/books/BooksApp';
import FormDialog from './features/FormDialog/FormDialog.container';
import DeletionDialog from './features/DeletionDialog/DeletionDialog.container';
import NotFound from './NotFound';
import LoginForm from './features/login/LoginForm.container';
import Nav from './features/navMenu/Nav.container';
import './i18n';

function App() {
  return (
    <div className="App">
      <Nav />
      <div className='App-content'>
        <Routes>
          <Route path='/' element={<BooksApp />}>
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
