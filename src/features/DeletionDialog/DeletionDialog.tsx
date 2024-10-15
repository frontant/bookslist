import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material';
import React from "react";
import { useTranslation } from "react-i18next";
import { IFetchError } from "../../FetchError";
import DeletionErrorDialog from "./DeletionErrorDialog";

type Props = {
  id: string,
  error?: IFetchError,
  open: boolean,
  onClose: () => void,
  onConfirm: (confirmed:boolean) => void,
};

const DeletionDialog:React.FC<Props> = ({id, open, error, onClose, onConfirm}) => {
  const { t } = useTranslation();

  if(error) {
    return <DeletionErrorDialog
              error={error}
              open={open}
              onClose={onClose} />
  } else {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description">
  
        <DialogTitle id="confirm-dialog-title" sx={{ paddingRight: 8 }}>
          { error ? t('form.error.error') : t('form.title.confirm-deletion') }
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
          { t('form.text.confirm-deletion', { id })}
        </DialogContent>
  
        <DialogActions>
          <Button onClick={() => onConfirm(false)}>{t('form.action.cancel')}</Button>
          <Button onClick={() => onConfirm(true)}>{t('form.action.ok')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeletionDialog;
