import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { getToken } from 'next-app/src/features/shared/utils/helpers';
import { ITokensByAccountOOT } from 'next-app/src/features/management/core/entities/TokensOOT';

const tokensByAccountAdapter = (dataRaw: ITokensByAccountOOT | undefined): ITokens | null => {
  if (dataRaw && dataRaw.account) {
    let tokens: ITokens | null = null;
    const { tokenBalances } = dataRaw.account;
    if (tokenBalances) {
      tokens = {};
      for (let i = 0; i < tokenBalances.length; i++) {
        const { valueExact, tokenToken } = tokenBalances[i];
        tokens[tokenToken.id] = getToken(tokenToken, valueExact, null);
      }
      return tokens;
    }
    return null;
  }
  return null;
};

export default tokensByAccountAdapter;
