import { pollInterval } from '@features/shared/utils/constants';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { useTokensAndTokenTypesByMember } from '@features/management/ui/hooks/useTokensAndTokenTypesByMember';
import TokensControlCardList from '@features/management/ui/tokens/TokensControlCardList';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import styles from '@features/shared/styles/modules/page/Page.module.css';
import { Module } from '@shared/utils/interfaces';

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
