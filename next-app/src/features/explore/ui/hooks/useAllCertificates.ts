import { useCallback, useEffect, useState } from 'react';
import { queryAllCertificatesWithDep } from '@features/explore/core/interactors';
import { getTime } from '@features/shared/utils/helpers/helpers';
import { CertificatesState } from '@features/shared/utils/interfaces';

export function useAllCertificates(pollInterval?: number): CertificatesState {
  const [certificatesState, setCertificatesState] = useState<CertificatesState>({ error: null, data: null });

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
