import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../modules/GlobalContext';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, IconButton } from '@mui/material';
import { CheckOutlined as CheckOutlinedIcon } from '@mui/icons-material';
import { getContracts, updateContract } from '../utils/axiosHelper';
import { connectContract } from '../utils/contractHelper';

const columns = (approveHandler, currentContract, submit) => [
    { field: 'address', headerName: 'Contract Address', width: 350 },
    { field: 'arbiter', headerName: 'Arbiter Address', width: 350 },
    { field: 'beneficiary', headerName: 'Beneficiary Address', width: 350 },
    { field: 'deposit', headerName: 'Deposit Amount (ETH)', width: 200, renderCell: (params) => (params.row.deposit?.hex ? (parseInt(params.row.deposit?.hex, 16)/ 10**18) : '') },
    {
        field: 'approved',
        headerName: 'Actions',
        renderCell: (params) => params.row.approved ? 
        null :
        currentContract.address === params.row.address && submit ? <CircularProgress /> : <IconButton aria-label='approve' color='primary' onClick={()=>approveHandler(params.row)}>
            <CheckOutlinedIcon />
        </IconButton>,
        width: 150,
    }
  ];

const ContractTable = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const { contracts, signer } = state;
    const [ currentContract, setCurrentContract ] = useState({});
    const [ submit, setSubmit ] = useState(false);

    useEffect(()=> {
        const fetchContracts = async() => {
            const contracts = await getContracts();
            dispatch({ 
                payload: contracts,
                type: 'FETCH_CONTRACTS'
            });
        };
        fetchContracts();
    },[dispatch]);

    const approveHandler = async(contract) => {
        setCurrentContract(contract);
        setSubmit(true);
        try{
            const contractETH = await connectContract(signer, contract.address);
            const approveTxn = await contractETH.approve();
            await approveTxn.wait();
            const contracts = await updateContract({...contract, approved: true });
            dispatch({ 
                payload: contracts,
                type: 'FETCH_CONTRACTS'
            });
        }catch(e){
            console.log('Something went wrong');
        }
        setCurrentContract({});
        setSubmit(false);
    }

    return (
        <DataGrid
            rows={contracts}
            columns={columns(approveHandler, currentContract, submit)}
            getRowId={(row) =>  row.address}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
        />
    );
}

export default ContractTable;