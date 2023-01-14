import { getTokenType } from 'next-app/src/features/shared/utils/helpers';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { IAllTokenTypesOOT } from 'next-app/src/features/explore/core/entities/TokenTypesOOT';

const allTokenTypesAdapter = (dataRaw: IAllTokenTypesOOT | undefined): ITokenTypes | null => {
  if (dataRaw && dataRaw.tokenTypes) {
    let tokenTypes: ITokenTypes | null = null;
    if (dataRaw.tokenTypes.length > 0) {
      tokenTypes = {};
      for (let i = 0; i < dataRaw.tokenTypes.length; i++) {
        const tokenTypeOOT = dataRaw.tokenTypes[i];
        tokenTypes[tokenTypeOOT.id] = getTokenType(tokenTypeOOT);
      }
    }
    return tokenTypes;
  }
  return null;
};

export default allTokenTypesAdapter;
