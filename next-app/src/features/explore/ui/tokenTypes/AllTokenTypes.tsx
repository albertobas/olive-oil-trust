import TokenTypesSearchCardList from '@features/explore/ui/tokenTypes/TokenTypesSearchCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';
import { TokenTypesState } from '@features/shared/utils/interfaces';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';

const AllTokenTypes = ({ error, data }: TokenTypesState): JSX.Element => {
  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {data ? getUTCFromTimestamp(data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {error ? (
        <FallbackMessage message="Token types could not be retrieved" error />
      ) : error === false ? (
        <TokenTypesSearchCardList tokenTypes={data?.tokenTypes ?? null} />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default AllTokenTypes;
