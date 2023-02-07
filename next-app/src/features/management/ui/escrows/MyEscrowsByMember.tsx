import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useEscrowsByMember } from 'next-app/src/features/management/ui/hooks/useEscrowsByMember';
import EscrowsSearchCardList from 'next-app/src/features/shared/ui/escrows/EscrowsSearchCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

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
