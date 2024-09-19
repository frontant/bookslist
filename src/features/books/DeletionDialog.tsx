import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material';
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetBookRemoveState, selectBookRemoveError, selectBookRemoveState } from "./booksSlice";
import { removeBookAction } from "./books.actions";
import { useNavigateWithQuery } from "./customHooks";
import { useTranslation } from "react-i18next";

function DeletionDialog() {
  const [ open, setOpen ] = useState(false);
  const { id } = useParams<{id:string}>();
  const navigate = useNavigateWithQuery();
  const dispatch = useAppDispatch();
  const bookRemoveState = useAppSelector(selectBookRemoveState);
  const bookRemoveError = useAppSelector(selectBookRemoveError);
  const { t } = useTranslation();

  const onClose = useCallback(() => {
    dispatch(resetBookRemoveState());
    setOpen(false);
    navigate('/');
  }, [navigate, dispatch]);

  useEffect(() => {
    if(bookRemoveState === 'completed') {
      onClose();
    } else {
      setOpen(true);
    }
  }, [id, bookRemoveState, onClose]);

  function onConfirm(confirmed: boolean) {
    if(confirmed && id) {
      dispatch(removeBookAction.request(id));
    } else {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description">

      <DialogTitle id="confirm-dialog-title" sx={{ paddingRight: 8 }}>
        { bookRemoveState === 'error' ? t('form.error.error') : t('form.title.confirm-deletion') }
      </DialogTitle>

      <IconButton
        onClick={() => onConfirm(false)}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}>
        <Close />
      </IconButton>

      <DialogContent id="confirm-dialog-description">
        { bookRemoveState === 'error' ?
          <div className="error">{bookRemoveError?.message && t(bookRemoveError.message, bookRemoveError.messageParams)}</div> :
          t('form.text.confirm-deletion', { id })
        }
      </DialogContent>

      { bookRemoveState !== 'error' &&
        <DialogActions>
          <Button onClick={() => onConfirm(false)}>{t('form.action.cancel')}</Button>
          <Button onClick={() => onConfirm(true)}>{t('form.action.ok')}</Button>
        </DialogActions>}
    </Dialog>
  );
}

export default DeletionDialog;
