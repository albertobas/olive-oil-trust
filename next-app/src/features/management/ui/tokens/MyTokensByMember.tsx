import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useTokensAndTokenTypesByMember } from 'next-app/src/features/management/ui/hooks/useTokensAndTokenTypesByMember';
import TokensControlCardList from 'next-app/src/features/management/ui/tokens/TokensControlCardList';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'src/features/shared/styles/modules/page/Page.module.css';
import { Module } from 'next-app/src/shared/utils/interfaces';

type Props = {
  address: string;
  moduleId: Module;
};

const MyTokensByMember = ({ address, moduleId }: Props): JSX.Element => {
  const { tokensState, tokenTypesState } = useTokensAndTokenTypesByMember(address, pollInterval);

  return (
    <>
      <div className={styles.layout}>
        <p className={styles.textSm}>
          <b>Last updated:</b> {tokensState.data ? getUTCFromTimestamp(tokensState.data.lastUpdated) : 'loading...'}
        </p>
      </div>
      {tokensState.error && tokenTypesState.error ? (
        <FallbackMessage message="Tokens and token types could not be retrieved" error />
      ) : tokensState.error ? (
        <FallbackMessage message="Tokens could not be retrieved" error />
      ) : tokenTypesState.error ? (
        <FallbackMessage message="Token types could not be retrieved" error />
      ) : tokensState.error === false && tokenTypesState.error === false ? (
        <TokensControlCardList
          tokens={tokensState.data?.tokens ?? null}
          tokenTypes={tokenTypesState.data?.tokenTypes ?? null}
          moduleId={moduleId}
        />
      ) : (
        <FallbackMessage />
      )}
    </>
  );
};

export default MyTokensByMember;
