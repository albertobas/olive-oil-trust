import { useCallback, useEffect, useState } from 'react';
import { queryCertificateByIdWithDep } from '@features/explore/core/interactors';
import { CertificateState } from '@features/shared/utils/interfaces';

export function useCertificateById(id: string, pollInterval?: number): CertificateState {
  const [certificatesState, setCertificatesState] = useState<CertificateState>({ error: null, data: null });

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    const { error, data } = await queryCertificateByIdWithDep(id);
    setCertificatesState({ error, data });
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

  return certificatesState;
}
