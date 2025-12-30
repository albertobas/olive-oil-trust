import { useCallback, useEffect, useState } from 'react';
import { queryTokensByAccountWithDep } from '@features/management/core/interactors';
import { TokensState } from '@features/shared/utils/interfaces';
import { getTime } from '@features/shared/utils/helpers/helpers';

export function useTokensByAccount(address: string, pollInterval?: number): TokensState {
  const [tokensState, setTokensState] = useState<TokensState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryTokensByAccountWithDep(address);
    setTokensState({ error, data: { tokens: data, lastUpdated: getTime() } });
  }, [address]);

  useEffect(() => {
    let t: NodeJS.Timer | null = null;

    if (pollInterval) {
      t = setInterval(fetchData, pollInterval);
    } else {
      fetchData();
    }

    return () => {
      t && clearInterval(t);
    };
  }, [fetchData, pollInterval]);

  return tokensState;
}
