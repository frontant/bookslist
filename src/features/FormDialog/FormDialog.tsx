import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, IconButton, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { Book, InputBook } from '../books/Book';
import formValidationSchema from './formValidationSchema';
import { useTranslation } from 'react-i18next';
import { IFetchError } from '../../FetchError';

type Props = {
  open: boolean,
  book?: Book,
  error?: IFetchError,
  onClose: () => void,
  onSave: (book: InputBook) => void,
}

const FormDialog:React.FC<Props> = ({ open, book, error, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<InputBook>({
    resolver: yupResolver(formValidationSchema),
  });
  const { t } = useTranslation();

  useEffect(() => {
    if(book) {
      reset(book);
    } else {
      reset({
        title: '',
        author: '',
        isbn: '',
      });
    }
  }, [book, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
      aria-describedby='form-dialog-description'>
      <DialogTitle id='form-dialog-title'>
        { book ? t('form.title.edit-book') : t('form.title.add-new-book') }
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
          {error && <div className='error'>{t('form.error.error')}: {t(error.message, error.messageParams)}</div>}
          <Grid container direction={'column'} rowSpacing='16px' display='flex'>
            <Grid>
              <TextField fullWidth={true} label={t('form.field-label.title')} error={!!errors.title} {...register('title')}/>
              { errors.title && <div className='error'>{t(errors.title.message || '')}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label={t('form.field-label.author')}  error={!!errors.author} {...register('author')}/>
              { errors.author && <div className='error'>{errors.author.message}</div> }
            </Grid>
            <Grid>
              <TextField fullWidth={true} label={t('form.field-label.isbn')}  error={!!errors.isbn} {...register('isbn')}/>
              { errors.isbn && <div className='error'>{errors.isbn.message}</div> }
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('form.action.cancel')}</Button>
          <Button type='submit'>{t('form.action.save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default FormDialog;
