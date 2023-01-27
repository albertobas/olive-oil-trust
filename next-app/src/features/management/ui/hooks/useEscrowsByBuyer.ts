import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import queryEscrowsByBuyer from 'next-app/src/features/management/core/interactors/queryEscrowsByBuyer';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import { IEscrowsState } from 'next-app/src/features/shared/utils/interfaces';

export function useEscrowsByBuyer(address: string, pollInterval?: number): IEscrowsState {
  const [escrowsState, setEscrowsState] = useState<IEscrowsState>({ error: null, data: null });
  const endpoint = useEndpoint();

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setEscrowsState({ error: true, data: null });
    } else {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryEscrowsByBuyer(endpoint.data, address);
        if (error) {
          // if error retrieving data
          setEscrowsState({ error: true, data: null });
        } else {
          // if error retrieving data is false
          setEscrowsState({ error: false, data: { escrows: data, lastUpdated: getTime() } });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setEscrowsState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    }
  }, [address, endpoint.data, endpoint.error]);

  useEffect(() => {
    fetchData();

    let t: NodeJS.Timer | null = null;

    if (pollInterval) {
      t = setInterval(fetchData, pollInterval);
    }

    return () => {
      t && clearInterval(t);
    };
  }, [fetchData, pollInterval]);

  return escrowsState;
}
