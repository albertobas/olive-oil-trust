import { getTokenType } from '@features/shared/utils/helpers/tokenType';
import { TokenType } from '@features/shared/core/entities/TokenTypes';
import { TokenTypeByIdQuery } from '.graphclient';

const tokenTypeByIdAdapter = (dataRaw: TokenTypeByIdQuery): TokenType | null => {
  if (dataRaw.tokenType) {
    return getTokenType(dataRaw.tokenType);
  }
  return null;
};

export default tokenTypeByIdAdapter;
