import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useTokensByAccount } from 'next-app/src/features/management/ui/hooks/useTokensByAccount';
import TokensControlCardList from 'next-app/src/features/management/ui/tokens/TokensControlCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';

type Props = { address: string };

const MyTokensByAccount = ({ address }: Props): JSX.Element => {
  const { error, data } = useTokensByAccount(address, pollInterval);

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
        <TokensControlCardList tokens={data?.tokens ?? null} />
      </>
    );
  }

  // Loading
  return <FallbackMessage />;
};

export default MyTokensByAccount;
