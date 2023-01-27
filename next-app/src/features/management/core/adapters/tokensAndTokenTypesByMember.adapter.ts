import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { getToken, getTokenType } from 'next-app/src/features/shared/utils/helpers';
import { ITokensAndTokenTypesByMember } from 'next-app/src/features/management/core/entities/MyTokens';
import { ITokensAndTokenTypesByMemberOOT } from 'next-app/src/features/management/core/entities/MyTokensOOT';

const tokensAndTokenTypesByMemberAdapter = (
  dataRaw: ITokensAndTokenTypesByMemberOOT | undefined
): ITokensAndTokenTypesByMember | null => {
  if (dataRaw && dataRaw.memberContract) {
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
        const tokenTypesOOT = ownerOfTokenContract[i].tokenTypes;
        if (tokenTypesOOT && tokenTypesOOT.length > 0) {
          tokenTypes = {};
          for (let i = 0; i < tokenTypesOOT.length; i++) {
            const tokenTypeOOT = tokenTypesOOT[i];
            tokenTypes[tokenTypeOOT.id] = getTokenType(tokenTypeOOT);
          }
        }
      }
    }

    if (tokenBalances) {
      tokens = {};
      for (let i = 0; i < tokenBalances.length; i++) {
        const { tokenToken, valueExact } = tokenBalances[i];
        tokens[tokenToken.id] = getToken(tokenToken, valueExact, mintedTokenIds);
      }
    }
    return {
      tokens: tokens ? (Object.keys(tokens).length > 0 ? tokens : null) : null,
      tokenTypes: tokenTypes ? (Object.keys(tokenTypes).length > 0 ? tokenTypes : null) : null
    };
  }
  return null;
};

export default tokensAndTokenTypesByMemberAdapter;
