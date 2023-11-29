// Example for a parent component
import React, { createContext, useState, useEffect } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { ethers } from 'ethers';
import { contractAddresses, abi } from '../constants';

// Define the context type
type ExampleContextType = {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  signerAddress: string;
  contractAddress: string;
  contract: ethers.Contract;
  setContract: React.Dispatch<React.SetStateAction<ethers.Contract>>;
  exampleParentVariable: string;
  updateContractValues: () => void;
  contractFunction: () => void;
  contractIsLoading: boolean;
  contractIsFetching: boolean;
};

export const Example = createContext<ExampleContextType | undefined>(undefined);

export const ExampleForContract = ({ children }) => {
  // Example for useful contract variables to keep in a parent component
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>(null);
  const contractAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [contract, setContract] = useState<ethers.Contract>(null);
  const [signerAddress, setSignerAddress] = useState('');

  // Example Variables that would be filled by a contract
  const [exampleParentVariable, setExampleParentVariable] = useState('');

  const cleanedAbi = abi.map((item) => {
    const { gas, ...itemWithoutGas } = item;
    return itemWithoutGas;
  });

  // Update UI When isWeb3 is Enabled or changes
  useEffect(() => {
    if (isWeb3Enabled) {
      updateContract();
      updateContractValues();
    }
  }, [isWeb3Enabled]);

  // Update UI
  async function updateContractValues() {
    // Update to variables with view functions
    const contractFunctionCallback = await contractFunction();
    const contractFunctionCallback_Alternative = await contract.contractFunction();

    setExampleParentVariable(contractFunctionCallback.toString());
  }

  // Set Raffel Contract
  async function updateContract() {
    const p = new ethers.providers.Web3Provider((window as any).ethereum);
    const s = p.getSigner();
    const sa = await s.getAddress();
    const c = new ethers.Contract(contractAddress, cleanedAbi, p);
    setProvider(p);
    setSigner(s);
    setSignerAddress(sa);
    setContract(c);
  }

  // Contracts
  const {
    runContractFunction: contractFunction,
    isLoading: contractIsLoading,
    isFetching: contractIsFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: 'contractFunction',
    params: {},
    msgValue: 0,
  });

  // Export Variables
  return (
    <Example.Provider
      value={{
        // Const Contract Variables
        chainId,
        provider,
        signer,
        signerAddress,
        contractAddress,
        contract,
        setContract,
        // State Variables
        exampleParentVariable,
        // Functions
        updateContractValues,
        // Contract Functions,
        contractFunction,
        contractIsLoading,
        contractIsFetching,
      }}
    >
      {children}
    </Example.Provider>
  );
};
