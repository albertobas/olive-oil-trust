import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useCertificatesByMemberAndAllTokenTypes } from 'next-app/src/features/management/ui/hooks/useCertificatesByMemberAndAllTokenTypes';
import CertificatesControlCardList from 'next-app/src/features/management/ui/certificates/CertificatesControlCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

type Props = {
  address: string;
};

const MyCertificatesByMember = ({ address }: Props): JSX.Element => {
  const { certificatesState, tokenTypesState } = useCertificatesByMemberAndAllTokenTypes(address, pollInterval);

  if (certificatesState.error && tokenTypesState.error) {
    return <FallbackMessage message="Certificates and token types could not be retrieved" error />;
  }

  if (certificatesState.error) {
    return <FallbackMessage message="Certificates could not be retrieved" error />;
  }

  if (tokenTypesState.error) {
    return <FallbackMessage message="Token types could not be retrieved" error />;
  }

  if (certificatesState.error === false && tokenTypesState.error === false) {
    return (
      <>
        {certificatesState.data && (
          <div className={styles.layout}>
            <p className={styles.lastUpdated}>
              <b>Last updated:</b> {getUTCFromTimestamp(certificatesState.data.lastUpdated)}
            </p>
          </div>
        )}
        <CertificatesControlCardList
          certificates={certificatesState.data?.certificates ?? null}
          tokenTypes={tokenTypesState.data?.tokenTypes ?? null}
        />
      </>
    );
  }

  return <FallbackMessage />;
};

export default MyCertificatesByMember;
