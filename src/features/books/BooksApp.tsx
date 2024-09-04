import { useState } from 'react';
import { Fab, Grid2 as Grid, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import List from './List';
import { IFetchError } from '../../FetchError';
import ErrorMessage from '../../ErrorMessage';

function BooksApp() {
  const [ filter, setFilter ] = useState('');

  // TODO: show errors
  const [ error ] = useState<IFetchError|null>(null);

  // TODO: filter books

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <Grid container
        direction='column'
        alignItems="center"
        paddingLeft={2}
        paddingRight={2}
        rowSpacing={2}
        data-testid='books-grid'>
        <Grid width='100%'>
          <TextField
            label='filter books'
            value={filter}
            onChange={(e) => setFilter(e.target.value)} />
        </Grid>
        <Grid size={{xs:12, md:10}}>
          <List />
        </Grid>
        <Fab
          color='primary'
          sx={{ transform:'translateY(-50%)' }}
          onClick={() => console.log('TODO: onAdd()')}>
          <Add />
        </Fab>
      </Grid>
    </>
  );
}

export default BooksApp;
