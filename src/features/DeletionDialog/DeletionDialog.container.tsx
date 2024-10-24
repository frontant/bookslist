import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigateWithQuery } from "../books/customHooks";
import DeletionDialog from "./DeletionDialog";
import DeletionErrorDialog from "./DeletionErrorDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "../books/booksAPI";
import { convertToFetchError, IFetchError } from "../../FetchError";

function DeletionDialogContainer() {
  const [ open, setOpen ] = useState(false);
  const { id } = useParams<{id:string}>();
  const navigate = useNavigateWithQuery();
  const [ error, setError ] = useState<IFetchError|null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['books']});
      onClose();
    },
    onError(err) {
      setError(convertToFetchError(err));
    }
  });
  
  const onClose = useCallback(() => {
    setError(null);
    setOpen(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    setOpen(true);
  }, []);

  function onConfirm(confirmed: boolean) {
    if(confirmed && id) {
      mutation.mutate(id);
    } else {
      onClose();
    }
  }

  if(id) {
    return <DeletionDialog
              id={id}
              open={open}
              error={error || undefined}
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
