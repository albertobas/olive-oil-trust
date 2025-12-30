import TokensSearchCardList from '@features/explore/ui/tokens/TokensSearchCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';
import { TokensState } from '@features/shared/utils/interfaces';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';

const AllTokens = ({ error, data }: TokensState): JSX.Element => {
  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {data ? getUTCFromTimestamp(data?.lastUpdated) : 'loading...'}
        </p>
      </div>
      {error ? (
        <FallbackMessage message="Tokens could not be retrieved" error />
      ) : error === false ? (
        <TokensSearchCardList tokens={data?.tokens ?? null} />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default AllTokens;
