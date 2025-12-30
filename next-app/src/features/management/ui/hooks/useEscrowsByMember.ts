import { useCallback, useEffect, useState } from 'react';
import { queryEscrowsByMemberWithDep } from '@features/management/core/interactors';
import { getTime } from '@features/shared/utils/helpers/helpers';
import { EscrowsState } from '@features/shared/utils/interfaces';

export function useEscrowsByMember(address: string, pollInterval?: number): EscrowsState {
  const [escrowsState, setEscrowsState] = useState<EscrowsState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryEscrowsByMemberWithDep(address);
    setEscrowsState({ error, data: { escrows: data, lastUpdated: getTime() } });
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

  return escrowsState;
}
