import { EscrowSate, IMember } from '@features/shared/utils/interfaces';
import { Transaction } from '@features/shared/core/entities/Events';
import { TokensInfo } from '@features/shared/core/entities/Tokens';

export interface Escrow {
  id: string;
  identifier: string;
  buyer: IMember | null;
  buyerWallet: string | null;
  contract: string;
  escrowBalance: {
    id: string;
    escrowAccount: string | null;
    tokensInfo: TokensInfo | null;
  };
  etherBalance: {
    id: string;
    value: number | null;
    valueExact: number | null;
  };
  price: number | null;
  seller: IMember | null;
  sellerWallet: string | null;
  state: EscrowSate | null;
  title: string;
  tokenDeposits: { transaction: Transaction }[];
}

export interface Escrows {
  [escrowId: string]: Escrow;
}
