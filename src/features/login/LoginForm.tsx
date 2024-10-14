import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, IconButton, TextField } from "@mui/material";
import { Login } from "./Login";
import { yupResolver } from "@hookform/resolvers/yup";
import loginValidationSchema from "./loginValidationSchema";
import { useForm } from "react-hook-form";
import React from "react";
import { useTranslation } from "react-i18next";
import { IFetchError } from "../../FetchError";

type Props = {
  onClose: () => void,
  onLogin: (login:Login) => void,
  error?: IFetchError,
  open: boolean,
};

const LoginForm:React.FC<Props> = ({ onClose, onLogin, open, error }) => {
  const {
    register,
    handleSubmit,
    formState:{errors},
  } = useForm<Login>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { t } = useTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      aria-labelledby="login-form-title"
      aria-describedby="login-form-description">
      <DialogTitle id='login-form-title'>{t('form.title.login')}</DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <Close />
      </IconButton>
      
      <form onSubmit={handleSubmit(onLogin)}>
        <DialogContent id='login-form-description'>
          { error && <div className="error">{t('form.error.error')}: {t(error.message, error.messageParams)}</div>}
          <Grid container direction="column" rowSpacing={1}>
            <Grid>
              <TextField fullWidth={true} label={t('form.field-label.username')} error={!!errors.user} {...register('user')}></TextField>
              { errors.user && <div className="error">{errors.user.message}</div>}
            </Grid>
            <Grid>
              <TextField type="password" fullWidth={true} label={t('form.field-label.password')} error={!!errors.password} {...register('password')}></TextField>
              { errors.password && <div className="error">{errors.password.message}</div>}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('form.action.cancel')}</Button>
          <Button type='submit'>{t('form.action.login')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LoginForm;
