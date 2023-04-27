import axios from 'axios';
const API_URL = 'http://localhost:3001';

export const getContracts = async() => {
  const response = await axios({
      method: 'GET',
      url: `${API_URL}/contracts`,
    });
  return response.data;
}

export const storeContract = async(contract) => {
    const response = await axios({
        method: 'POST',
        url: `${API_URL}/addContract`,
        data: contract
      });
    return response.data;
}

export const updateContract = async(contract) => {
  const response = await axios({
      method: 'PUT',
      url: `${API_URL}/updateContract`,
      data: contract
    });
  return response.data;
}