import { useCallback, useEffect, useState } from 'react';
import { queryAllTokenTypesWithDep } from 'next-app/src/features/explore/core/interactors';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
import { TokenTypesState } from 'next-app/src/features/shared/utils/interfaces';

export function useAllTokenTypes(pollInterval?: number): TokenTypesState {
  const [tokenTypesState, setTokenTypesState] = useState<TokenTypesState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryAllTokenTypesWithDep();
    setTokenTypesState({ error, data: { tokenTypes: data, lastUpdated: getTime() } });
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

  return tokenTypesState;
}
