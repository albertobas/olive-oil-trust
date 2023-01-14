import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import queryAllTokenTypes from 'next-app/src/features/explore/core/interactors/queryAllTokenTypes';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import { ITokenTypesState } from 'next-app/src/features/shared/utils/interfaces';

export function useAllTokenTypes(pollInterval?: number): ITokenTypesState {
  const [tokenTypesState, setTokenTypesState] = useState<ITokenTypesState>({ error: null, data: null });
  const endpoint = useEndpoint();

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setTokenTypesState({ error: true, data: null });
    } else if (endpoint.error === false) {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryAllTokenTypes(endpoint.data);
        if (error) {
          // if error retrieving data
          setTokenTypesState({ error: true, data: null });
        } else if (error === false) {
          // if error retrieving data is false
          setTokenTypesState({ error: false, data: { tokenTypes: data, lastUpdated: getTime() } });
        } else {
          // if data are still being retrieved
          setTokenTypesState({ error: null, data: null });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setTokenTypesState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    } else {
      // endpoint error is null, still getting an endpoint
      setTokenTypesState({ error: null, data: null });
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

  return tokenTypesState;
}
