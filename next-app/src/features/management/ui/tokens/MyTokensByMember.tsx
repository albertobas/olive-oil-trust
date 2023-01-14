import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useTokensAndTokenTypesByMember } from 'next-app/src/features/management/ui/hooks/useTokensAndTokenTypesByMember';
import TokensControlCardList from 'next-app/src/features/management/ui/tokens/TokensControlCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';
import { Module } from 'next-app/src/shared/utils/interfaces';

type Props = {
  address: string;
  moduleId: Module;
};

const MyTokensByMember = ({ address, moduleId }: Props): JSX.Element => {
  const { tokensState, tokenTypesState } = useTokensAndTokenTypesByMember(address, pollInterval);

  if (tokensState.error && tokenTypesState.error) {
    return <FallbackMessage message="Tokens and token types could not be retrieved" error />;
  }

  if (tokensState.error) {
    return <FallbackMessage message="Tokens could not be retrieved" error />;
  }

  if (tokenTypesState.error) {
    return <FallbackMessage message="Token types could not be retrieved" error />;
  }

  // as long as errors are false we can render the component as data may be null because it has not yet been created
  if (tokensState.error === false && tokenTypesState.error === false) {
    return (
      <>
        {tokensState.data && (
          <div className={styles.layout}>
            <p className={styles.lastUpdated}>
              <b>Last updated:</b> {getUTCFromTimestamp(tokensState.data.lastUpdated)}
            </p>
          </div>
        )}
        <TokensControlCardList
          tokens={tokensState.data?.tokens ?? null}
          tokenTypes={tokenTypesState.data?.tokenTypes ?? null}
          moduleId={moduleId}
        />
      </>
    );
  }
  // loading
  return <FallbackMessage />;
};

export default MyTokensByMember;
