import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useAllCertificates } from 'next-app/src/features/explore/ui/hooks/useAllCertificates';
import CertificatesSearchCardList from 'next-app/src/features/explore/ui/certificates/CertificatesSearchCardList';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

const AllCertificates = (): JSX.Element => {
  const { error, data } = useAllCertificates(pollInterval);

  if (error) {
    return <FallbackMessage message="Certificates could not be retrieved" error />;
  }

  if (error === false) {
    return (
      <>
        {data && (
          <div className={styles.layout}>
            <p className={styles.lastUpdated}>
              <b>Last updated:</b> {getUTCFromTimestamp(data.lastUpdated)}
            </p>
          </div>
        )}
        <CertificatesSearchCardList certificates={data?.certificates ?? null} />
      </>
    );
  }

  return <FallbackMessage />;
};

export default AllCertificates;
