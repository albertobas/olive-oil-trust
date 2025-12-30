import { Tokens } from '@features/shared/core/entities/Tokens';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';

export interface TokensAndTokenTypesByMember {
  tokens: Tokens | null;
  tokenTypes: TokenTypes | null;
}
