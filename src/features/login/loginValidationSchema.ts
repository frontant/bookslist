import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  user: Yup.string().required('Benutzername ist ein Pflichtfeld'),
  password: Yup.string().required('Passwort ist ein Pflichtfeld'),
});

export default loginValidationSchema;
