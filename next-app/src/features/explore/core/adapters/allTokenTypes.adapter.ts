import { getTokenType } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { AllTokenTypesQuery } from 'next-app/.graphclient';

const allTokenTypesAdapter = (dataRaw: AllTokenTypesQuery): ITokenTypes | null => {
  if (dataRaw.tokenTypes.length > 0) {
    const tokenTypes: ITokenTypes = {};
    for (let i = 0; i < dataRaw.tokenTypes.length; i++) {
      const tokenTypeOOT = dataRaw.tokenTypes[i];
      tokenTypes[tokenTypeOOT.id] = getTokenType(tokenTypeOOT);
    }
    return tokenTypes;
  }
  return null;
};

export default allTokenTypesAdapter;
