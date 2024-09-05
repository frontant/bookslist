import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material';
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IFetchError } from "../../FetchError";
import { useAppDispatch } from "../../app/hooks";
import { removeBook } from "./booksSlice";

function DeletionDialog() {
  const [ open, setOpen ] = useState(false);
  const { id } = useParams<{id:string}>();
  const [ fetchError ] = useState<IFetchError|null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    setOpen(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    setOpen(true);
  }, [id]);

  function onConfirm(confirmed: boolean) {
    if(confirmed && id) {
      dispatch(removeBook(id));
      onClose();
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

      <DialogTitle id="confirm-dialog-title">
        { fetchError ? 'Error' : 'Confirm deletion' }
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
        { fetchError && <div className="error">{fetchError.message}</div>}
        { !fetchError && `Do you want remove "${id}"?`}
      </DialogContent>

      { !fetchError &&
        <DialogActions>
          <Button onClick={() => onConfirm(false)}>Abbrechen</Button>
          <Button onClick={() => onConfirm(true)}>Ok</Button>
        </DialogActions>}
    </Dialog>
  );
}

export default DeletionDialog;
