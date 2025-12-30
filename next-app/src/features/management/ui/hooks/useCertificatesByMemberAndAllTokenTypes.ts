import { useCallback, useEffect, useState } from 'react';
import { getTime } from '@features/shared/utils/helpers/helpers';
import { queryCertificatesByMemberAndAllTokenTypesWithDep } from '@features/management/core/interactors';
import { TokenTypesState, CertificatesState } from '@features/shared/utils/interfaces';

export function useCertificatesByMemberAndAllTokenTypes(
  address: string,
  pollInterval?: number
): { certificatesState: CertificatesState; tokenTypesState: TokenTypesState } {
  const [certificatesState, setCertificatesState] = useState<CertificatesState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<TokenTypesState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryCertificatesByMemberAndAllTokenTypesWithDep(address);
    const lastUpdated = getTime();
    setCertificatesState({ error, data: { certificates: data?.certificates ?? null, lastUpdated } });
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

  return { certificatesState, tokenTypesState };
}
