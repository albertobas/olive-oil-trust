import { getTokenType } from '@features/shared/utils/helpers/tokenType';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';
import { AllTokenTypesQuery } from '.graphclient';

const allTokenTypesAdapter = (dataRaw: AllTokenTypesQuery): TokenTypes | null => {
  if (dataRaw.tokenTypes.length > 0) {
    const tokenTypes: TokenTypes = {};
    for (let i = 0; i < dataRaw.tokenTypes.length; i++) {
      const tokenTypeOOT = dataRaw.tokenTypes[i];
      tokenTypes[tokenTypeOOT.id] = getTokenType(tokenTypeOOT);
    }
    return tokenTypes;
  }
  return null;
};

export default allTokenTypesAdapter;
