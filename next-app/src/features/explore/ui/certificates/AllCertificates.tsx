import CertificatesSearchCardList from '@features/explore/ui/certificates/CertificatesSearchCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';
import { CertificatesState } from '@features/shared/utils/interfaces';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';

const AllCertificates = ({ error, data }: CertificatesState): JSX.Element => {
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
