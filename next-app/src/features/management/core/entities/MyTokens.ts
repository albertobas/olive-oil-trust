import { Tokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { TokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface TokensAndTokenTypesByMember {
  tokens: Tokens | null;
  tokenTypes: TokenTypes | null;
}
