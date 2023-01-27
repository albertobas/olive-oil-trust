import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import { ITokenTypesState, ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';
import queryAllTokenTypesAndCertificates from 'next-app/src/features/management/core/interactors/queryAllTokenTypesAndCertificates';

export function useAllTokenTypesAndCertificates(pollInterval?: number): {
  tokenTypesState: ITokenTypesState;
  certificatesState: ICertificatesState;
} {
  const [certificatesState, setCertificatesState] = useState<ICertificatesState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<ITokenTypesState>({ error: null, data: null });
  const endpoint = useEndpoint();

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setTokenTypesState({ error: true, data: null });
      setCertificatesState({ error: true, data: null });
    } else {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryAllTokenTypesAndCertificates(endpoint.data);
        if (error) {
          // if error retrieving data
          setTokenTypesState({ error: true, data: null });
          setCertificatesState({ error: true, data: null });
        } else if (error === false) {
          // if error retrieving data is false
          if (data) {
            // if data have been retrieved
            const { certificates, tokenTypes } = data;
            setTokenTypesState({ error: false, data: { tokenTypes, lastUpdated: getTime() } });
            setCertificatesState({ error: false, data: { certificates, lastUpdated: getTime() } });
          } else {
            // if there are no data
            setTokenTypesState({ error: false, data: null });
            setCertificatesState({ error: false, data: null });
          }
        } else {
          // if data are still being retrieved
          setTokenTypesState({ error: null, data: null });
          setCertificatesState({ error: null, data: null });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setTokenTypesState({ error: true, data: null });
        setCertificatesState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    }
  }, [endpoint.data, endpoint.error]);

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

  return { tokenTypesState, certificatesState };
}
