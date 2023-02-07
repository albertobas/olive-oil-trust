import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { getToken } from 'next-app/src/features/shared/utils/helpers/token';
import { getTokenType } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { ITokensAndTokenTypesByMember } from 'next-app/src/features/management/core/entities/MyTokens';
import { TokensAndTokenTypesByMemberQuery } from 'next-app/.graphclient';

const tokensAndTokenTypesByMemberAdapter = (
  dataRaw: TokensAndTokenTypesByMemberQuery
): ITokensAndTokenTypesByMember | null => {
  if (dataRaw.memberContract) {
    const { ownerOfTokenContract, tokenBalances } = dataRaw.memberContract.asAccount;
    let tokens: ITokens | null = null;
    let tokenTypes: ITokenTypes | null = null;
    const mintedTokenIds: string[] = [];
    if (ownerOfTokenContract) {
      for (let i = 0; i < ownerOfTokenContract.length; i++) {
        const mintedTokens = ownerOfTokenContract[i].tokens;
        if (mintedTokens) {
          for (let j = 0; j < mintedTokens.length; j++) {
            mintedTokenIds.push(mintedTokens[j].id);
          }
        }
        const tokenTypesRaw = ownerOfTokenContract[i].tokenTypes;
        if (tokenTypesRaw && tokenTypesRaw.length > 0) {
          tokenTypes = {};
          for (let i = 0; i < tokenTypesRaw.length; i++) {
            const tokenTypeRaw = tokenTypesRaw[i];
            tokenTypes[tokenTypeRaw.id] = getTokenType(tokenTypeRaw);
          }
        }
      }
    }
    if (tokenBalances && tokenBalances.length > 0) {
      tokens = {};
      for (let i = 0; i < tokenBalances.length; i++) {
        const { tokenToken, valueExact } = tokenBalances[i];
        if (tokenToken) {
          tokens[tokenToken.id] = getToken(tokenToken, valueExact, mintedTokenIds);
        }
      }
    }
    return { tokens, tokenTypes };
  }
  return null;
};

export default tokensAndTokenTypesByMemberAdapter;
