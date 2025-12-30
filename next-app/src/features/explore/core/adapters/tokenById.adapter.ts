import { Token } from '@features/shared/core/entities/Tokens';
import { getToken } from '@features/shared/utils/helpers/token';
import { TokenByIdQuery } from '.graphclient';

const tokenByIdAdapter = (dataRaw: TokenByIdQuery): Token | null => {
  if (dataRaw.token) {
    return getToken(dataRaw.token, null, null);
  }
  return null;
};

export default tokenByIdAdapter;
