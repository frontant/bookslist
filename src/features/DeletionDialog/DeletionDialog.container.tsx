import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetBookRemoveState, selectBookRemoveError, selectBookRemoveState } from "../books/booksSlice";
import { removeBookAction } from "../books/books.actions";
import { useNavigateWithQuery } from "../books/customHooks";
import DeletionDialog from "./DeletionDialog";
import DeletionErrorDialog from "./DeletionErrorDialog";

function DeletionDialogContainer() {
  const [ open, setOpen ] = useState(false);
  const { id } = useParams<{id:string}>();
  const navigate = useNavigateWithQuery();
  const dispatch = useAppDispatch();
  const bookRemoveState = useAppSelector(selectBookRemoveState);
  const bookRemoveError = useAppSelector(selectBookRemoveError);

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

  if(id) {
    return <DeletionDialog
              id={id}
              open={open}
              error={bookRemoveState === 'error' ? bookRemoveError! : undefined}
              onClose={onClose}
              onConfirm={onConfirm} />
  } else {
    return <DeletionErrorDialog
              error={{ message: 'error.book-deletion-failed', messageParams: { id }}}
              open={open}
              onClose={onClose}/>
  }
}

export default DeletionDialogContainer;
