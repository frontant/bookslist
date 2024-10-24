import { useCallback, useEffect, useState } from 'react';
import { Book, InputBook } from '../books/Book';
import { useParams } from 'react-router-dom';
import { useNavigateWithQuery } from '../books/customHooks';
import FormDialog from './FormDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBooks, saveBook } from '../books/booksAPI';
import { convertToFetchError, IFetchError } from '../../FetchError';

function FormDialogContainer() {
  const { id } = useParams<{id:string}>();
  const [ open, setOpen ] = useState(false);
  const navigate = useNavigateWithQuery();
  const [ error, setError ] = useState<IFetchError|null>(null);
  const [ book, setBook ] = useState<Book|null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: saveBook,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['books']});
      onClose();
    },
    onError(err) {
      setError(convertToFetchError(err));
    },
  });

  useEffect(() => {
    (async () => {
      if(id) {
        try {
          const books = await queryClient.ensureQueryData({ queryKey: ['books'], queryFn: fetchBooks});
          const book = books ? books.find(book => book.id === id) || null : null;

          if(!book) {
            throw new Error(`Book with the id ${id} doesn't exist`);
          }

          setBook(book);
        } catch(err) {
          setError(convertToFetchError(err));
        }
      }

      setOpen(true);
    })();
  }, [id, queryClient]);

  const onClose = useCallback(() => {
    setError(null);
    setOpen(false);
    navigate('/');
  }, [navigate]);

  function onSave(book: InputBook) {
    mutation.mutate(book);
  }

  return <FormDialog
            open={open}
            book={book || undefined}
            error={error || undefined}
            onSave={onSave}
            onClose={onClose}/>
}

export default FormDialogContainer;
