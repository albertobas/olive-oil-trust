import { ITokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface ITokensAndTokenTypesByMember {
  tokens: ITokens | null;
  tokenTypes: ITokenTypes | null;
}
