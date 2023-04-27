import React, { useContext, useState } from 'react';
import { Alert, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { GlobalContext } from '../modules/GlobalContext';
import { deploy } from '../utils/contractHelper';
import { storeContract } from '../utils/axiosHelper';

const initialState = {
    arbiter: '',
    beneficiary: '',
    amount: '',
};

const NewContract = () => {

    const { state, dispatch } = useContext(GlobalContext);
    const { signer } = state;

    const [contractForm, setContractForm] = useState(initialState);
    const [submit, setSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({});

    const handleChange = (e) => {
        setContractForm(previousState => 
            ({...previousState,
                [e.target.name]: e.target.value})
        );   
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmit(true);
        const { arbiter, beneficiary, amount } = contractForm;
        setMessage({});
        if(arbiter && beneficiary && amount){
            setSubmitting(true);
            let contract;
            try{
                contract = await deploy(signer, arbiter, beneficiary, amount);
            }catch(e){
                setMessage({ type: 'error', message: 'Something went wrong deploying the contract'});
            };
            if(contract){
                try{
                    const contracts = await storeContract({ arbiter, beneficiary, deposit: amount, approved: false, address: contract.address });
                    dispatch({ 
                        payload: contracts,
                        type: "FETCH_CONTRACTS"
                    });
                    setMessage({ type: 'success', message: 'Contract deployed and stored successfully'});
                    setContractForm(initialState);
                    setSubmit(false);
                }catch(e){
                    setMessage({ type: 'error', message: 'Something went wrong storing the contract in the backend'});
                };
            }
            setSubmitting(false);
        }
    }

    const handleClear = () => {
        setContractForm(initialState);
        setSubmit(false);
        setSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit} className='newContractForm'>
            <h1> New Contract </h1>
            <Grid>
                <TextField
                    disabled={submitting}
                    fullWidth
                    margin='dense'
                    name='arbiter'
                    label='Arbiter Address'
                    variant='standard'
                    value={contractForm.arbiter}
                    onChange={handleChange}
                    error={submit && !contractForm.arbiter}
                    helperText={submit && !contractForm.arbiter ? 'Please define the arbiter address' : ''}/>
            </Grid>
            <Grid>
                <TextField
                    disabled={submitting}
                    fullWidth
                    margin='dense'
                    name='beneficiary'
                    label='Beneficiary Address'
                    variant='standard'
                    value={contractForm.beneficiary}
                    onChange={handleChange}
                    error={submit && !contractForm.beneficiary}
                    helperText={submit && !contractForm.beneficiary ? 'Please define the beneficiary address' : ''}/>
            </Grid>
            <Grid>
                <TextField
                    disabled={submitting}
                    fullWidth
                    type='number'
                    name='amount'
                    margin='dense'
                    label='Deposit Amount (in Wei)'
                    variant='standard'
                    value={contractForm.amount}
                    onChange={handleChange}
                    error={submit && !contractForm.amount}
                    helperText={submit && !contractForm.amount ? 'Please define the deposit amount' : ''}/>
            </Grid>
            <Button
                disabled={submitting}
                type='submit'
                variant='outlined'
                id='deploy'>
                    {submitting ? <CircularProgress />:'Deploy'}
            </Button>
            <Button
                sx={{marginLeft: '2%'}}
                color='success'
                disabled={submitting}
                onClick={handleClear}
                variant='outlined'
                id='deploy'>
                    Clear
            </Button>
            {message.message && <Alert severity={message.type}>{message.message}</Alert>}
        </form>
    );
}

export default NewContract;