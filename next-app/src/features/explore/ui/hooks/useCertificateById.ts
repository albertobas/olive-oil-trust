import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import queryCertificateById from 'next-app/src/features/explore/core/interactors/queryCertificateById';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import { ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';

export function useCertificateById(id: string, pollInterval?: number): ICertificatesState {
  const [certificatesState, setCertificatesState] = useState<ICertificatesState>({ error: null, data: null });
  const endpoint = useEndpoint();

  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setCertificatesState({ error: true, data: null });
    } else {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryCertificateById(endpoint.data, id);
        if (error) {
          // if error retrieving data
          setCertificatesState({ error: true, data: null });
        } else {
          // if error retrieving data is false
          setCertificatesState({
            error: false,
            data: { certificates: data ? { [data.id]: data } : null, lastUpdated: getTime() }
          });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setCertificatesState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    }
  }, [endpoint.data, endpoint.error, id]);

  useEffect(() => {
    fetchData();

    let t: NodeJS.Timer | null = null;

    if (pollInterval) {
      t = setInterval(fetchData, pollInterval);
    }

    return () => {
      t && clearInterval(t);
    };
  }, [fetchData, pollInterval]);

  return certificatesState;
}
