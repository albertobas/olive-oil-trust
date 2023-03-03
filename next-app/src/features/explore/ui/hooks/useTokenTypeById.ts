import { useCallback, useEffect, useState } from 'react';
import { queryTokenTypeByIdWithDep } from 'next-app/src/features/explore/core/interactors';
import { TokenTypeState } from 'next-app/src/features/shared/utils/interfaces';

export function useTokenTypeById(id: string, pollInterval?: number): TokenTypeState {
  const [tokenTypesState, setTokenTypesState] = useState<TokenTypeState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryTokenTypeByIdWithDep(id);
    setTokenTypesState({ error, data });
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

  return tokenTypesState;
}
