import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useAllTokenTypes } from 'next-app/src/features/explore/ui/hooks/useAllTokenTypes';
import TokenTypesSearchCardList from 'next-app/src/features/explore/ui/tokenTypes/TokenTypesSearchCardList';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

const AllTokenTypes = (): JSX.Element => {
  const { error, data } = useAllTokenTypes(pollInterval);

  if (error) {
    return <FallbackMessage message="Token types could not be retrieved" error />;
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
        <TokenTypesSearchCardList tokenTypes={data?.tokenTypes ?? null} />
      </>
    );
  }

  return <FallbackMessage />;
};

export default AllTokenTypes;
