import { useAllTokenTypesAndCertificates } from 'next-app/src/features/management/ui/hooks/useAllTokenTypesAndCertificates';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import TokenTypesControlCardList from 'next-app/src/features/management/ui/tokenTypes/TokenTypesControlCardList';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';
import { Module } from 'next-app/src/shared/utils/interfaces';

type Props = {
  memberAddress: string;
  moduleId: Module;
  previousRoles?: string[];
};

const MyTokenTypes = ({ memberAddress, moduleId, previousRoles }: Props): JSX.Element => {
  const { tokenTypesState, certificatesState } = useAllTokenTypesAndCertificates(pollInterval);

  if (tokenTypesState.error && certificatesState.error) {
    return <FallbackMessage message="Token types and certificates could not be retrieved" error />;
  }

  if (tokenTypesState.error) {
    return <FallbackMessage message="Token types could not be retrieved" error />;
  }

  if (certificatesState.error) {
    return <FallbackMessage message="Certificates could not be retrieved" error />;
  }

  if (tokenTypesState.error === false && certificatesState.error === false) {
    return (
      <>
        {tokenTypesState.data && (
          <div className={styles.layout}>
            <p className={styles.lastUpdated}>
              <b>Last updated:</b> {getUTCFromTimestamp(tokenTypesState.data.lastUpdated)}
            </p>
          </div>
        )}
        <TokenTypesControlCardList
          tokenTypes={tokenTypesState.data?.tokenTypes ?? null}
          certificates={certificatesState.data?.certificates ?? null}
          memberAddress={memberAddress}
          moduleId={moduleId}
          previousRoles={previousRoles}
        />
      </>
    );
  }

  // loading
  return <FallbackMessage />;
};

export default MyTokenTypes;
