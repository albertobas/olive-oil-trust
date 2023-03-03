import { useCallback, useEffect, useState } from 'react';
import { queryAllTokensWithDep } from 'next-app/src/features/explore/core/interactors';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
import { TokensState } from 'next-app/src/features/shared/utils/interfaces';

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
