import { useCallback, useEffect, useState } from 'react';
import { queryTokensByAccountWithDep } from 'next-app/src/features/management/core/interactors';
import { ITokensState } from 'next-app/src/features/shared/utils/interfaces';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';

export function useTokensByAccount(address: string, pollInterval?: number): ITokensState {
  const [tokensState, setTokensState] = useState<ITokensState>({ error: null, data: null });

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
