import { useCallback, useEffect, useState } from 'react';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
import { queryCertificatesByMemberAndAllTokenTypesWithDep } from 'next-app/src/features/management/core/interactors';
import { ITokenTypesState, ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';

export function useCertificatesByMemberAndAllTokenTypes(
  address: string,
  pollInterval?: number
): { certificatesState: ICertificatesState; tokenTypesState: ITokenTypesState } {
  const [certificatesState, setCertificatesState] = useState<ICertificatesState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<ITokenTypesState>({ error: null, data: null });

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
