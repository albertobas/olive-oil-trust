import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAppDispatch from 'next-app/src/shared/ui/hooks/useAppDispatch';
import Web3Modal from 'web3modal';
import { providers } from 'ethers';
import { setProvider } from 'next-app/src/app/state/providerSlice';
import { toast } from 'react-toastify';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { brandName, pages } from 'next-app/src/shared/utils/constants';
import { setAccount } from 'next-app/src/shared/state/accountSlice';
import accountsJSON from 'next-app/src/generated/contracts/accounts.json';
import { setConnection } from 'next-app/src/shared/state/connectionSlice';
import { renderToast } from 'next-app/src/shared/utils/helpers';

const useConnection = (): {
  connectWallet: () => void;
  disconnectWallet: () => void;
  isConnected: boolean;
  isConnecting: boolean;
} => {
  const dispatch = useAppDispatch();
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);
  const { pathname } = useRouter();

  function connectWallet() {
    dispatch(setConnection({ isConnected: false, isConnecting: true }));
  }

  const connectWalletCallback = useCallback(async () => {
    const toastId = toast.loading('Connecting...');
    const { ethereum } = window;

    function connect(requestedAccounts: string[], chainId: string) {
      if (Array.isArray(requestedAccounts) && typeof requestedAccounts[0] === 'string' && typeof chainId === 'string') {
        const chainIdInt = parseInt(chainId, 16).toString();
        if (Object.keys(accountsJSON).includes(chainIdInt)) {
          const account = requestedAccounts[0];
          const accounts = accountsJSON[chainIdInt as keyof typeof accountsJSON];
          const data = Object.keys(accounts).includes(account) ? accounts[account as keyof typeof accounts] : null;
          const web3Modal = new Web3Modal();
          web3Modal
            .connect()
            .then((connection) => {
              const provider = new providers.Web3Provider(connection);
              dispatch(setProvider({ error: false, data: provider }));
              dispatch(
                setAccount({
                  data: {
                    account: account,
                    chainId: chainIdInt,
                    contract: data
                      ? {
                          address: data.address,
                          moduleId:
                            data.moduleId === 'BottleManufacturerUpgradeable'
                              ? 'BottleManufacturerUpgradeable'
                              : data.moduleId === 'BottlingPlantUpgradeable'
                              ? 'BottlingPlantUpgradeable'
                              : data.moduleId === 'CertifierUpgradeable'
                              ? 'CertifierUpgradeable'
                              : data.moduleId === 'DistributorUpgradeable'
                              ? 'DistributorUpgradeable'
                              : data.moduleId === 'OliveGrowerUpgradeable'
                              ? 'OliveGrowerUpgradeable'
                              : data.moduleId === 'OliveOilMillUpgradeable'
                              ? 'OliveOilMillUpgradeable'
                              : data.moduleId === 'RetailerUpgradeable'
                              ? 'RetailerUpgradeable'
                              : null,
                          name: data.name
                        }
                      : null
                  }
                })
              );
              dispatch(setConnection({ isConnected: true, isConnecting: false }));
              renderToast(toastId, 'You have connected succesfully');
            })
            .catch((error) => {
              dispatch(setProvider({ error: true, data: null }));
              dispatch(setAccount({ data: null }));
              dispatch(setConnection({ isConnected: false, isConnecting: false }));
              renderToast(toastId, 'The connection has failed', error);
              console.error(error);
            });
        } else {
          throw new Error('The chain is not valid.');
        }
      }
    }

    try {
      if (ethereum && ethereum.request) {
        const { request } = ethereum;
        request({ method: 'eth_requestAccounts' })
          .then((requestedAccounts: string[]) => {
            request({ method: 'eth_chainId' })
              .then((chainId: string) => {
                if (requestedAccounts.length > 0 && chainId.length > 0 && typeof requestedAccounts[0] === 'string') {
                  connect(requestedAccounts, chainId);
                } else {
                  throw new Error('Unable to fetch account details.');
                }
              })
              .catch((error: any) => {
                dispatch(setAccount({ data: null }));
                dispatch(setConnection({ isConnected: false, isConnecting: false }));
                renderToast(toastId, 'The connection has failed', error);
                console.error(error);
              });
          })
          .catch((error: any) => {
            if (error.code === -32002) {
              dispatch(setAccount({ data: null }));
              renderToast(
                toastId,
                'A request to connect to you wallet has already been dispatched. Please check your wallet.'
              );
            } else {
              dispatch(setAccount({ data: null }));
              renderToast(toastId, 'The connection has failed', error);
              console.error(error);
            }
            dispatch(setConnection({ isConnected: false, isConnecting: false }));
          });
      } else {
        throw new Error(`You need a wallet to use ${brandName}.`);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setAccount({ data: null }));
        renderToast(toastId, 'The connection has failed', error);
        console.error(error);
      }
      dispatch(setConnection({ isConnected: false, isConnecting: false }));
    }
  }, [dispatch]);

  const disconnectWallet = useCallback(() => {
    const toastId = toast.loading('Disconnecting...');
    const web3Modal = new Web3Modal();
    web3Modal.clearCachedProvider();
    dispatch(setConnection({ isConnected: false, isConnecting: false }));
    dispatch(setProvider({ error: false, data: null }));
    renderToast(toastId, `You have disconnected from ${brandName}`);
  }, [dispatch]);

  const handleChange = useCallback(async () => {
    if (isConnected) {
      if (pathname === pages.HOME.url) {
        window.location.reload();
      } else {
        window.location.href = pages.HOME.url;
      }
    }
  }, [isConnected, pathname]);

  useEffect(() => {
    if (isConnecting) {
      connectWalletCallback();
    }
  }, [connectWalletCallback, isConnecting]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleChange);
      window.ethereum.on('chainChanged', handleChange);
      window.ethereum.on('disconnect', disconnectWallet);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleChange);
        window.ethereum.removeListener('chainChanged', handleChange);
        window.ethereum.removeListener('disconnect', disconnectWallet);
      }
    };
  }, [disconnectWallet, handleChange]);

  return { connectWallet, disconnectWallet, isConnected, isConnecting };
};

export default useConnection;
