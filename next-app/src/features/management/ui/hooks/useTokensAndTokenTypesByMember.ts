import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import queryTokensAndTokenTypesByMember from 'next-app/src/features/management/core/interactors/queryTokensAndTokenTypesByMember';
import { ITokensState, ITokenTypesState } from 'next-app/src/features/shared/utils/interfaces';
import { getTime } from 'next-app/src/features/shared/utils/helpers';

export function useTokensAndTokenTypesByMember(
  address: string,
  pollInterval?: number
): { tokensState: ITokensState; tokenTypesState: ITokenTypesState } {
  const [tokensState, setTokensState] = useState<ITokensState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<ITokenTypesState>({ error: null, data: null });
  const endpoint = useEndpoint();

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setTokensState({ error: true, data: null });
      setTokenTypesState({ error: true, data: null });
    } else if (endpoint.error === false) {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryTokensAndTokenTypesByMember(
          endpoint.data,
          address
          // isCreator,
          // includeInstructions
        );
        if (error) {
          // if error retrieving data
          setTokensState({ error: true, data: null });
          setTokenTypesState({ error: true, data: null });
        } else if (error === false) {
          // if error retrieving data is false
          if (data) {
            const { tokens, tokenTypes } = data;
            // if data have been retrieved
            setTokensState({ error: false, data: { tokens, lastUpdated: getTime() } });
            setTokenTypesState({ error: false, data: { tokenTypes, lastUpdated: getTime() } });
          } else {
            // if there are no data
            setTokensState({ error: false, data: null });
            setTokenTypesState({ error: false, data: null });
          }
        } else {
          // if data are still being retrieved
          setTokensState({ error: null, data: null });
          setTokenTypesState({ error: null, data: null });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setTokensState({ error: true, data: null });
        setTokenTypesState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    } else {
      // endpoint error is null, still getting an endpoint
      setTokensState({ error: null, data: null });
      setTokenTypesState({ error: null, data: null });
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

  return { tokensState, tokenTypesState };
}
