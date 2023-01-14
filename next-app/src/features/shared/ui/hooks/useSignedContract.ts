import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import contractsJson from 'next-app/src/generated/contracts/hardhat_contracts.json';
import { IContractState } from 'next-app/src/features/shared/ui/utils/interfaces';

const useSignedContract = (contractName: string | null): IContractState => {
  const [contract, setContract] = useState<IContractState>({ error: null, data: null });
  const providerState = useAppSelector((state) => state.provider);

  // create a callback function with the use cases
  const fetchContract = useCallback(() => {
    const network = window.ethereum.networkVersion;
    const contractObject = contractsJson[network as keyof typeof contractsJson];

    if (typeof contractObject != 'undefined' && contractName) {
      const contracts = contractObject[0].contracts;
      if (Object.keys(contracts).includes(contractName)) {
        const rawContract = contracts[contractName as keyof typeof contracts];
        const abi = rawContract.abi;
        const address = rawContract.address;
        if (providerState.error) {
          setContract({ error: true, data: null });
        } else if (providerState.error === false) {
          if (providerState.data) {
            const signer = providerState.data.getSigner();
            const contract = new Contract(address, abi, signer);
            setContract({ error: false, data: contract });
          } else {
            setContract({ error: false, data: null });
          }
        } else {
          setContract({ error: null, data: null });
        }
      } else {
        setContract({ error: true, data: null });
      }
    } else {
      setContract({ error: true, data: null });
    }
  }, [contractName, providerState.data, providerState.error]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return contract;
};

export default useSignedContract;
