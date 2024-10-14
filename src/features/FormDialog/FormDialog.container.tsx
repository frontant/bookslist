import { useCallback, useEffect, useMemo, useState } from 'react';
import { InputBook } from '../books/Book';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetBookSaveState, selectBook, selectBookSaveError, selectBookSaveState } from '../books/booksSlice';
import { saveBookAction } from '../books/books.actions';
import { useNavigateWithQuery } from '../books/customHooks';
import FormDialog from './FormDialog';

function FormDialogContainer() {
  const { id } = useParams<{id:string}>();
  const [ open, setOpen ] = useState(false);
  const navigate = useNavigateWithQuery();
  const getBook = useAppSelector(selectBook);
  const dispatch = useAppDispatch();
  const bookSaveState = useAppSelector(selectBookSaveState);
  const bookSaveError = useAppSelector(selectBookSaveError);

  const book = useMemo(() => id ? getBook(id)! : undefined, [id, getBook]);

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    dispatch(resetBookSaveState());
    setOpen(false);
    navigate('/');
  }, [navigate, dispatch]);

  useEffect(() => {
    if(bookSaveState === 'completed') {
      onClose();
    }
  }, [onClose, bookSaveState]);

  function onSave(book: InputBook) {
    dispatch(saveBookAction.request(book));
  }

  return <FormDialog
            open={open}
            book={book}
            error={bookSaveState ? bookSaveError! : undefined}
            onSave={onSave}
            onClose={onClose}/>
}

export default FormDialogContainer;
