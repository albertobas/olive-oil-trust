import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { ITokenOOT } from 'next-app/src/features/shared/core/entities/TokensOOT';
import { getToken } from 'next-app/src/features/shared/utils/helpers';
import { IAllTokensOOT } from 'next-app/src/features/explore/core/entities/TokensOOT';

function allTokensAdapter(dataRaw: IAllTokensOOT | undefined): ITokens | null {
  if (dataRaw && dataRaw.tokens) {
    let tokens: ITokens | null = null;

    if (dataRaw.tokens.length > 0) {
      tokens = {};
      for (let i = 0; i < dataRaw.tokens.length; i++) {
        const tokenOOT: ITokenOOT = dataRaw.tokens[i];
        tokens[tokenOOT.id] = getToken(tokenOOT, null, null);
      }
      return tokens;
    }
    return null;
  }
  return null;
}

export default allTokensAdapter;
