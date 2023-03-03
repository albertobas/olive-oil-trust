import { Tokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { getToken } from 'next-app/src/features/shared/utils/helpers/token';
import { AllTokensQuery } from 'next-app/.graphclient';

function allTokensAdapter(dataRaw: AllTokensQuery): Tokens | null {
  if (dataRaw.tokens.length > 0) {
    const tokens: Tokens = {};
    for (let i = 0; i < dataRaw.tokens.length; i++) {
      const tokenRaw = dataRaw.tokens[i];
      tokens[tokenRaw.id] = getToken(tokenRaw, null, null);
    }
    return tokens;
  }
  return null;
}

export default allTokensAdapter;
