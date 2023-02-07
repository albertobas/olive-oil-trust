import { getTokenType } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { TokenTypeByIdQuery } from 'next-app/.graphclient';

const tokenTypeByIdAdapter = (dataRaw: TokenTypeByIdQuery): ITokenType | null => {
  if (dataRaw.tokenType) {
    return getTokenType(dataRaw.tokenType);
  }
  return null;
};

export default tokenTypeByIdAdapter;
