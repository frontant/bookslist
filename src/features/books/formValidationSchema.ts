import * as Yup from 'yup';

const formValidationSchema = Yup.object().shape({
  title: Yup.string().required('form.error.title-required'),
  author: Yup.string().optional(),
  isbn: Yup.string().optional(),
});

export default formValidationSchema;
