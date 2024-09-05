import { Route, Routes } from 'react-router-dom';
import './App.css';
import BooksApp from './features/books/BooksApp';
import FormDialog from './features/books/FormDialog';
import DeletionDialog from './features/books/DeletionDialog';
import NotFound from './NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<BooksApp />}>
          <Route path='/new' element={<FormDialog />} />
          <Route path='/edit/:id' element={<FormDialog />} />
          <Route path='/delete/:id' element={<DeletionDialog />} />
        </Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </div>
  );
}

export default App;
