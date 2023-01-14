import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import queryTokenTypeById from 'next-app/src/features/explore/core/interactors/queryTokenTypeById';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import { ITokenTypesState } from 'next-app/src/features/shared/utils/interfaces';

export function useTokenTypeById(id: string, pollInterval?: number): ITokenTypesState {
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
        const { error, data } = await queryTokenTypeById(endpoint.data, id);
        if (error) {
          // if error retrieving data
          setTokenTypesState({ error: true, data: null });
        } else if (error === false) {
          // if error retrieving data is false
          setTokenTypesState({
            error: false,
            data: { tokenTypes: data ? { [data.id]: data } : null, lastUpdated: getTime() }
          });
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
  }, [endpoint.data, endpoint.error, id]);

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
