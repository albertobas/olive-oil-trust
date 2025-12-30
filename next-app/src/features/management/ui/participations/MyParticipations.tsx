import { pollInterval } from '@features/shared/utils/constants';
import EscrowsSearchCardList from '@features/shared/ui/escrows/EscrowsSearchCardList';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { useEscrowsByBuyer } from '@features/management/ui/hooks/useEscrowsByBuyer';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';

const MyParticipations = ({ address }: { address: string }): JSX.Element => {
  const { error, data } = useEscrowsByBuyer(address, pollInterval);

  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {data ? getUTCFromTimestamp(data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {error ? (
        <FallbackMessage message="Participations could not be retrieved" error />
      ) : error === false ? (
        <EscrowsSearchCardList escrows={data?.escrows ?? null} />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default MyParticipations;
