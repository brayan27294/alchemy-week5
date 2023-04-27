import React from 'react';
import NewContract from './components/NewContract';
import ContractTable from './components/ContractTable';
import { Grid } from '@mui/material';

const App = () => {
  return (
    <Grid container spacing={2} p={4}>
      <Grid item xs={2}>
        <NewContract />
      </Grid>
      <Grid item xs={10}>
        <ContractTable />
      </Grid>
    </Grid>
  );
}

export default App;