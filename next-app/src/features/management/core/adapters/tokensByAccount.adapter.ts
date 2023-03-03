import { Tokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { getToken } from 'next-app/src/features/shared/utils/helpers/token';
import { TokensByAccountQuery } from 'next-app/.graphclient';

const tokensByAccountAdapter = (dataRaw: TokensByAccountQuery): Tokens | null => {
  if (dataRaw.account) {
    const { tokenBalances } = dataRaw.account;
    if (tokenBalances) {
      const tokens: Tokens | null = {};
      for (let i = 0; i < tokenBalances.length; i++) {
        const { valueExact, tokenToken } = tokenBalances[i];
        if (tokenToken) {
          tokens[tokenToken.id] = getToken(tokenToken, valueExact, null);
        }
      }
      return tokens;
    }
  }
  return null;
};

export default tokensByAccountAdapter;
