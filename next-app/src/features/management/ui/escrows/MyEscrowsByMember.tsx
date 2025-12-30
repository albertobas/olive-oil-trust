import { pollInterval } from '@features/shared/utils/constants';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { useEscrowsByMember } from '@features/management/ui/hooks/useEscrowsByMember';
import EscrowsSearchCardList from '@features/shared/ui/escrows/EscrowsSearchCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';

const MyEscrowsByMember = ({ address }: { address: string }): JSX.Element => {
  const { error, data } = useEscrowsByMember(address, pollInterval);

  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {data ? getUTCFromTimestamp(data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {error ? (
        <FallbackMessage message="Escrows could not be retrieved" error />
      ) : error === false ? (
        <EscrowsSearchCardList escrows={data?.escrows ?? null} />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default MyEscrowsByMember;
