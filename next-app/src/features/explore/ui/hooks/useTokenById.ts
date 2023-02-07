import { useCallback, useEffect, useState } from 'react';
import { queryTokenByIdWithDep } from 'next-app/src/features/explore/core/interactors';
import { ITokenState } from 'next-app/src/features/shared/utils/interfaces';

export function useTokenById(id: string, pollInterval?: number): ITokenState {
  const [tokensState, setTokensState] = useState<ITokenState>({ error: null, data: null });

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
