import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useTokensByAccount } from 'next-app/src/features/management/ui/hooks/useTokensByAccount';
import TokensControlCardList from 'next-app/src/features/management/ui/tokens/TokensControlCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

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
