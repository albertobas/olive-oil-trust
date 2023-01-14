import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import EscrowsSearchCardList from 'next-app/src/features/shared/ui/escrows/EscrowsSearchCardList';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useEscrowsByBuyer } from 'next-app/src/features/management/ui/hooks/useEscrowsByBuyer';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

const MyParticipations = ({ address }: { address: string }): JSX.Element => {
  const { error, data } = useEscrowsByBuyer(address, pollInterval);

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

  // Loading
  return <FallbackMessage />;
};

export default MyParticipations;
