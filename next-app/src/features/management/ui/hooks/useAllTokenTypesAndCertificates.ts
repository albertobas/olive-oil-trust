import { useCallback, useEffect, useState } from 'react';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
import { ITokenTypesState, ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';
import { queryAllTokenTypesAndCertificatesWithDep } from 'next-app/src/features/management/core/interactors';

export function useAllTokenTypesAndCertificates(pollInterval?: number): {
  tokenTypesState: ITokenTypesState;
  certificatesState: ICertificatesState;
} {
  const [certificatesState, setCertificatesState] = useState<ICertificatesState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<ITokenTypesState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryAllTokenTypesAndCertificatesWithDep();
    const lastUpdated = getTime();
    setTokenTypesState({ error, data: { tokenTypes: data?.tokenTypes ?? null, lastUpdated } });
    setCertificatesState({ error, data: { certificates: data?.certificates ?? null, lastUpdated } });
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

  return { tokenTypesState, certificatesState };
}
