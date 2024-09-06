import { useState } from 'react';
import { Fab, Grid2 as Grid, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import List from './List';
import { Outlet, useNavigate } from 'react-router-dom';

function BooksApp() {
  const [ filter, setFilter ] = useState('');
  const navigate = useNavigate();

  // TODO: filter books
  function onFilter(filterBy: string) {
    setFilter(filterBy);
  }

  function onAdd() {
    navigate('/new');
  }

  return (
    <>
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
            onChange={(e) => onFilter(e.target.value)} />
        </Grid>
        <Grid size={{xs:12, md:10}}>
          <List />
        </Grid>
        <Fab
          color='primary'
          sx={{ transform:'translateY(-50%)' }}
          onClick={onAdd}>
          <Add />
        </Fab>
      </Grid>
      <Outlet />
    </>
  );
}

export default BooksApp;
