import { ethers } from 'ethers';
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow';

export const deploy = async(signer, arbiter, beneficiary, value) => {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  const escrowContract = await factory.deploy(arbiter, beneficiary, { value });
  await escrowContract.deployed();
  return escrowContract;
}

export const connectContract = async(signer, contractAddress) => {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  const escrowContract = await factory.attach(contractAddress);
  return escrowContract;
}
