import EscrowsSearchCardList from '@features/shared/ui/escrows/EscrowsSearchCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';
import { EscrowsState } from '@features/shared/utils/interfaces';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';

const AllEscrows = ({ error, data }: EscrowsState): JSX.Element => {
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

export default AllEscrows;
