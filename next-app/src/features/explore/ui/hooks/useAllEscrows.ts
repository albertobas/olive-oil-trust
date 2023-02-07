import { useCallback, useEffect, useState } from 'react';
import { queryAllEscrowsWithDep } from 'next-app/src/features/explore/core/interactors';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
import { IEscrowsState } from 'next-app/src/features/shared/utils/interfaces';

export function useAllEscrows(pollInterval?: number): IEscrowsState {
  const [escrowsState, setEscrowsState] = useState<IEscrowsState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryAllEscrowsWithDep();
    setEscrowsState({ error, data: { escrows: data, lastUpdated: getTime() } });
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

  return escrowsState;
}
