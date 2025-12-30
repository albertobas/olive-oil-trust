import { useCallback, useEffect, useState } from 'react';
import { queryTokenByIdWithDep } from '@features/explore/core/interactors';
import { TokenState } from '@features/shared/utils/interfaces';

export function useTokenById(id: string, pollInterval?: number): TokenState {
  const [tokensState, setTokensState] = useState<TokenState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryTokenByIdWithDep(id);
    setTokensState({ error, data });
  }, [id]);

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
