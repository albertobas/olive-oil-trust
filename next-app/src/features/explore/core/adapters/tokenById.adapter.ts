import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import { getToken } from 'next-app/src/features/shared/utils/helpers';
import { ITokenByIdOOT } from 'next-app/src/features/explore/core/entities/TokensOOT';

const tokenByIdAdapter = (dataRaw: ITokenByIdOOT | undefined): IToken | null => {
  if (dataRaw && dataRaw.token) {
    return getToken(dataRaw.token, null, null);
  }
  return null;
};

export default tokenByIdAdapter;
