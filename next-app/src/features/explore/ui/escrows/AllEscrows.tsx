import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useAllEscrows } from 'next-app/src/features/explore/ui/hooks/useAllEscrows';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import EscrowsSearchCardList from 'next-app/src/features/shared/ui/escrows/EscrowsSearchCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

const AllEscrows = (): JSX.Element => {
  const { error, data } = useAllEscrows(pollInterval);

  if (error) {
    return <FallbackMessage message="Escrows could not be retrieved" error />;
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
        <EscrowsSearchCardList escrows={data?.escrows ?? null} />
      </>
    );
  }
  return <FallbackMessage />;
};

export default AllEscrows;
