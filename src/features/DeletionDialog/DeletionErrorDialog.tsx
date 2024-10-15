import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React from "react";
import { IFetchError } from "../../FetchError";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean,
  error: IFetchError,
  onClose: () => void,
}

const DeletionErrorDialog:React.FC<Props> = ({ open, error, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}>

      <DialogTitle id="confirm-dialog-title" sx={{ paddingRight: 8 }}>
        <div className="error">{ t('form.error.error') } </div>
      </DialogTitle>

      <IconButton
        onClick={() => onClose()}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}>
        <Close />
      </IconButton>

      <DialogContent>
        {t(error.message, error.messageParams)}
      </DialogContent>
    </Dialog>
  );
}

export default DeletionErrorDialog;
