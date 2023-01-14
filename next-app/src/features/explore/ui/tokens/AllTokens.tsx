import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useAllTokens } from 'next-app/src/features/explore/ui/hooks/useAllTokens';
import TokensSearchCardList from 'next-app/src/features/explore/ui/tokens/TokensSearchCardList';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

const AllTokens = (): JSX.Element => {
  const { error, data } = useAllTokens(pollInterval);

  if (error) {
    return <FallbackMessage message="Tokens could not be retrieved" error />;
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
        <TokensSearchCardList tokens={data?.tokens ?? null} />
      </>
    );
  }

  return <FallbackMessage />;
};

export default AllTokens;
