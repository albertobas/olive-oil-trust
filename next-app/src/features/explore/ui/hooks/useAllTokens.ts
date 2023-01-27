import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import queryAllTokens from 'next-app/src/features/explore/core/interactors/queryAllTokens';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import { ITokensState } from 'next-app/src/features/shared/utils/interfaces';

export function useAllTokens(pollInterval?: number): ITokensState {
  const [tokensState, setTokensState] = useState<ITokensState>({ error: null, data: null });
  const endpoint = useEndpoint();

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setTokensState({ error: true, data: null });
    } else {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryAllTokens(endpoint.data);
        if (error) {
          // if error retrieving data
          setTokensState({ error: true, data: null });
        } else {
          // if error retrieving data is false
          setTokensState({ error: false, data: { tokens: data, lastUpdated: getTime() } });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setTokensState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    }
  }, [endpoint.data, endpoint.error]);

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

  return tokensState;
}
