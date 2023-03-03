import { Token } from 'next-app/src/features/shared/core/entities/Tokens';
import { getToken } from 'next-app/src/features/shared/utils/helpers/token';
import { TokenByIdQuery } from 'next-app/.graphclient';

const tokenByIdAdapter = (dataRaw: TokenByIdQuery): Token | null => {
  if (dataRaw.token) {
    return getToken(dataRaw.token, null, null);
  }
  return null;
};

export default tokenByIdAdapter;
