import { pollInterval } from '@features/shared/utils/constants';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { useTokensByAccount } from '@features/management/ui/hooks/useTokensByAccount';
import TokensControlCardList from '@features/management/ui/tokens/TokensControlCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';

type Props = { address: string };

const MyTokensByAccount = ({ address }: Props): JSX.Element => {
  const { error, data } = useTokensByAccount(address, pollInterval);

  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {data ? getUTCFromTimestamp(data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {error ? (
        <FallbackMessage message="Tokens could not be retrieved" error />
      ) : error === false ? (
        <TokensControlCardList tokens={data?.tokens ?? null} />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default MyTokensByAccount;
