import * as Yup from 'yup';

const formValidationSchema = Yup.object().shape({
  title: Yup.string().required('Titel ist ein Pflichtfeld.'),
  author: Yup.string().optional(),
  isbn: Yup.string().optional(),
});

export default formValidationSchema;
