import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, IconButton, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { InputBook } from './Book';
import formValidationSchema from './formValidationSchema';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetBookSaveState, saveBook, selectBook, selectBookSaveError, selectBookSaveState } from './booksSlice';

function FormDialog() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<InputBook>({
    resolver: yupResolver(formValidationSchema),
  });
  const { id } = useParams<{id:string}>();
  const [ open, setOpen ] = useState(false);
  const navigate = useNavigate();
  const getBook = useAppSelector(selectBook);
  const dispatch = useAppDispatch();
  const bookSaveState = useAppSelector(selectBookSaveState);
  const bookSaveError = useAppSelector(selectBookSaveError);

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

  useEffect(() => {
    if(id) {
      setOpen(true);
      const book = getBook(id);
      if(book) {
        reset(book);
      } else {
        reset({
          title: '',
          author: '',
          isbn: '',
        });
      }
    } else {
      setOpen(true);
    }
  }, [id, getBook, reset]);

  function onSave(book: InputBook) {
    dispatch(saveBook(book));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
      aria-describedby='form-dialog-description'>
      <DialogTitle id='form-dialog-title'>
        {id ? 'Buch bearbeiten' : 'Neues Buch anlegen'}
      </DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <Close />
      </IconButton>

      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent id='form-dialog-description'>
          {bookSaveState === 'error' && <div className='error'>Error: {bookSaveError?.message}</div>}
          <Grid container direction={'column'} rowSpacing={1} display='flex'>
            <Grid>
              <TextField fullWidth={true} label='Titel' error={!!errors.title} {...register('title')}/>
              { errors.title && <div className='error'>{errors.title.message}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label='Author' error={!!errors.author} {...register('author')}/>
              { errors.author && <div className='error'>{errors.author.message}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label='ISBN' error={!!errors.isbn} {...register('isbn')}/>
              { errors.isbn && <div className='error'>{errors.isbn.message}</div> }
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button type='submit'>Speichern</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default FormDialog;
