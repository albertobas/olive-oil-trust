import { getTokenType } from 'next-app/src/features/shared/utils/helpers';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { ITokenTypeByIdOOT } from 'next-app/src/features/explore/core/entities/TokenTypesOOT';

const tokenTypeByIdAdapter = (dataRaw: ITokenTypeByIdOOT | undefined): ITokenType | null => {
  if (dataRaw && dataRaw.tokenType) {
    return getTokenType(dataRaw.tokenType);
  }
  return null;
};

export default tokenTypeByIdAdapter;
