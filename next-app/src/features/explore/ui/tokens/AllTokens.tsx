import TokensSearchCardList from 'next-app/src/features/explore/ui/tokens/TokensSearchCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';
import { TokensState } from 'next-app/src/features/shared/utils/interfaces';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

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
