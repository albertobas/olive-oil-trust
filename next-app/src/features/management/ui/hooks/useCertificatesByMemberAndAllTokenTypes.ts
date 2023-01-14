import { useCallback, useEffect, useState } from 'react';
import useEndpoint from 'next-app/src/features/shared/ui/hooks/useEndpoint';
import { getTime } from 'next-app/src/features/shared/utils/helpers';
import queryCertificatesByMemberAndAllTokenTypes from 'next-app/src/features/management/core/interactors/queryCertificatesByMemberAndAllTokenTypes';
import { ITokenTypesState, ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';

export function useCertificatesByMemberAndAllTokenTypes(
  address: string,
  pollInterval?: number
): { certificatesState: ICertificatesState; tokenTypesState: ITokenTypesState } {
  const [certificatesState, setCertificatesState] = useState<ICertificatesState>({ error: null, data: null });
  const [tokenTypesState, setTokenTypesState] = useState<ITokenTypesState>({ error: null, data: null });
  const endpoint = useEndpoint();

  // create a callback function with the use cases
  const fetchData = useCallback(async () => {
    if (endpoint.error) {
      // if error retrieving endpoint
      setCertificatesState({ error: true, data: null });
      setTokenTypesState({ error: true, data: null });
    } else if (endpoint.error === false) {
      // if endpoint error is false
      if (endpoint.data) {
        // if there is an endpoint
        const { error, data } = await queryCertificatesByMemberAndAllTokenTypes(endpoint.data, address);
        if (error) {
          // if error retrieving data
          setCertificatesState({ error: true, data: null });
          setTokenTypesState({ error: true, data: null });
        } else if (error === false) {
          // if error retrieving data is false
          if (data) {
            const { certificates, tokenTypes } = data;
            // if data have been retrieved
            setCertificatesState({ error: false, data: { certificates, lastUpdated: getTime() } });
            setTokenTypesState({ error: false, data: { tokenTypes, lastUpdated: getTime() } });
          } else {
            // if there are no data
            setCertificatesState({ error: false, data: null });
            setTokenTypesState({ error: false, data: null });
          }
        } else {
          // if data are still being retrieved
          setCertificatesState({ error: null, data: null });
          setTokenTypesState({ error: null, data: null });
        }
      } else {
        // there is no endpoint, data cannot be retrieved
        setCertificatesState({ error: true, data: null });
        setTokenTypesState({ error: true, data: null });
        console.error('There is no endpoint, data cannot be retrieved');
      }
    } else {
      // endpoint error is null, still getting an endpoint
      setCertificatesState({ error: null, data: null });
      setTokenTypesState({ error: null, data: null });
    }
  }, [address, endpoint.data, endpoint.error]);

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

  return { certificatesState, tokenTypesState };
}
