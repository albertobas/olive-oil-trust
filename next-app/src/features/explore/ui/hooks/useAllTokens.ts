import { useCallback, useEffect, useState } from 'react';
import { queryAllTokensWithDep } from '@features/explore/core/interactors';
import { getTime } from '@features/shared/utils/helpers/helpers';
import { TokensState } from '@features/shared/utils/interfaces';

export function useAllTokens(pollInterval?: number): TokensState {
  const [tokensState, setTokensState] = useState<TokensState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryAllTokensWithDep();
    setTokensState({ error, data: { tokens: data, lastUpdated: getTime() } });
  }, []);

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
