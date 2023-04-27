import {createContext, useReducer} from 'react';
import { ethers } from 'ethers';
const provider = new ethers.providers.Web3Provider(window.ethereum);

const initialState = {
    contracts: [],
    provider,
    signer: provider.getSigner(),
};

// state reducer function
const reducer = (state, action) => {
    const { payload, type } = action;
    switch(type){
        case 'ADD_CONTRACT':
            return { ...state, contracts: [...state.contracts, payload] };
        case 'FETCH_CONTRACTS':
            return { ...state, contracts: payload };
        default:
            return state;
    }
};

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GlobalContext.Provider
        value={{
            state,
            dispatch
          }}>
            {props.children}
        </GlobalContext.Provider>
    );
  }