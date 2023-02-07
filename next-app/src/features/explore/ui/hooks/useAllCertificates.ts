import { useCallback, useEffect, useState } from 'react';
import { queryAllCertificatesWithDep } from 'next-app/src/features/explore/core/interactors';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
import { ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';

export function useAllCertificates(pollInterval?: number): ICertificatesState {
  const [certificatesState, setCertificatesState] = useState<ICertificatesState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryAllCertificatesWithDep();
    setCertificatesState({ error, data: { certificates: data, lastUpdated: getTime() } });
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

  return certificatesState;
}
