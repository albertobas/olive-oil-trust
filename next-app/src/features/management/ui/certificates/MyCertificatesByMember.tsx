import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useCertificatesByMemberAndAllTokenTypes } from 'next-app/src/features/management/ui/hooks/useCertificatesByMemberAndAllTokenTypes';
import CertificatesControlCardList from 'next-app/src/features/management/ui/certificates/CertificatesControlCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

type Props = {
  address: string;
};

const MyCertificatesByMember = ({ address }: Props): JSX.Element => {
  const { certificatesState, tokenTypesState } = useCertificatesByMemberAndAllTokenTypes(address, pollInterval);

  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b>{' '}
          {certificatesState.data ? getUTCFromTimestamp(certificatesState.data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {certificatesState.error && tokenTypesState.error ? (
        <FallbackMessage message="Certificates and token types could not be retrieved" error />
      ) : certificatesState.error ? (
        <FallbackMessage message="Certificates could not be retrieved" error />
      ) : tokenTypesState.error ? (
        <FallbackMessage message="Token types could not be retrieved" error />
      ) : certificatesState.error === false && tokenTypesState.error === false ? (
        <CertificatesControlCardList
          certificates={certificatesState.data?.certificates ?? null}
          tokenTypes={tokenTypesState.data?.tokenTypes ?? null}
        />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default MyCertificatesByMember;
