import { useCallback, useEffect, useState } from 'react';
import { queryTokensAndTokenTypesByMemberWithDep } from '@features/management/core/interactors';
import { TokensState, TokenTypesState } from '@features/shared/utils/interfaces';
import { getTime } from '@features/shared/utils/helpers/helpers';

export function useTokensAndTokenTypesByMember(
  address: string,
  pollInterval?: number
): { tokensState: TokensState; tokenTypesState: TokenTypesState } {
  const [tokensState, setTokensState] = useState<TokensState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<TokenTypesState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryTokensAndTokenTypesByMemberWithDep(address);
    const lastUpdated = getTime();
    setTokensState({ error, data: { tokens: data?.tokens ?? null, lastUpdated } });
    setTokenTypesState({ error, data: { tokenTypes: data?.tokenTypes ?? null, lastUpdated } });
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

  return { tokensState, tokenTypesState };
}
