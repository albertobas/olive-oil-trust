import CertificatesSearchCardList from 'next-app/src/features/explore/ui/certificates/CertificatesSearchCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';
import { ICertificatesState } from 'next-app/src/features/shared/utils/interfaces';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

const AllCertificates = ({ error, data }: ICertificatesState): JSX.Element => {
  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {data ? getUTCFromTimestamp(data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {error ? (
        <FallbackMessage message="Certificates could not be retrieved" error />
      ) : error === false ? (
        <CertificatesSearchCardList certificates={data?.certificates ?? null} />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default AllCertificates;
