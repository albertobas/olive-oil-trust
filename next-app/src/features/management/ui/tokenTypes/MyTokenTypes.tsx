import { useAllTokenTypesAndCertificates } from '@features/management/ui/hooks/useAllTokenTypesAndCertificates';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import TokenTypesControlCardList from '@features/management/ui/tokenTypes/TokenTypesControlCardList';
import { pollInterval } from '@features/shared/utils/constants';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';
import { Module } from '@shared/utils/interfaces';

type Props = {
  memberAddress: string;
  moduleId: Module;
  previousRoles?: string[];
};

const MyTokenTypes = ({ memberAddress, moduleId, previousRoles }: Props): JSX.Element => {
  const { tokenTypesState, certificatesState } = useAllTokenTypesAndCertificates(pollInterval);

  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b>{' '}
          {tokenTypesState.data ? getUTCFromTimestamp(tokenTypesState.data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {tokenTypesState.error && certificatesState.error ? (
        <FallbackMessage message="Token types and certificates could not be retrieved" error />
      ) : tokenTypesState.error ? (
        <FallbackMessage message="Token types could not be retrieved" error />
      ) : certificatesState.error ? (
        <FallbackMessage message="Certificates could not be retrieved" error />
      ) : tokenTypesState.error === false && certificatesState.error === false ? (
        <TokenTypesControlCardList
          tokenTypes={tokenTypesState.data?.tokenTypes ?? null}
          certificates={certificatesState.data?.certificates ?? null}
          memberAddress={memberAddress}
          moduleId={moduleId}
          previousRoles={previousRoles}
        />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default MyTokenTypes;
