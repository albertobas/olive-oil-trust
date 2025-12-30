import { Escrow } from '@features/shared/core/entities/Escrows';
import { checkEscrowState, parseTransaction } from '@features/shared/utils/helpers/helpers';
import { getMember } from '@features/shared/utils/helpers/member';
import { getTokensInfo } from '@features/shared/utils/helpers/token';
import { EscrowRawType } from '@features/shared/utils/interfaces';

export function getEscrow(escrow: EscrowRawType, selfProducedIds: string[] | null): Escrow {
  const {
    escrowBalance: { escrowAmounts, escrowTokens }
  } = escrow;
  return {
    id: escrow.id,
    buyer:
      escrow.buyer && 'asMemberContract' in escrow.buyer && escrow.buyer.asMemberContract
        ? getMember(escrow.buyer.asMemberContract)
        : null,
    buyerWallet: escrow.buyerWallet,
    contract: escrow.contract.id,
    escrowBalance: {
      id: escrow.escrowBalance.id,
      escrowAccount: escrow.escrowBalance.escrowAccount?.id ?? null,
      tokensInfo: escrowAmounts && escrowTokens ? getTokensInfo(escrowAmounts, escrowTokens, selfProducedIds) : null
    },
    etherBalance: {
      id: escrow.etherBalance.id,
      value: escrow.etherBalance.value ? parseFloat(escrow.etherBalance.value) : null,
      valueExact: escrow.etherBalance.valueExact ? parseInt(escrow.etherBalance.valueExact) : null
    },
    identifier: escrow.identifier.toString(),
    price: escrow.price ? parseFloat(escrow.price) : null,
    seller:
      escrow.seller && 'asMemberContract' in escrow.seller && escrow.seller.asMemberContract
        ? getMember(escrow.seller.asMemberContract)
        : null,
    sellerWallet: escrow.sellerWallet,
    state: escrow.state ? checkEscrowState(escrow.state) : null,
    title: `Escrow ${escrow.identifier}`,
    tokenDeposits: escrow.tokenDeposits.map(({ transaction }) => ({ transaction: parseTransaction(transaction) }))
  };
}

export const sortEscrowArray = (data: Escrow[], sortValue: string | undefined, reverse: boolean): Escrow[] => {
  if (reverse) {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.tokenDeposits[0].transaction.timestamp < b.tokenDeposits[0].transaction.timestamp
          ? -1
          : a.tokenDeposits[0].transaction.timestamp > b.tokenDeposits[0].transaction.timestamp
            ? 1
            : 0
      );
    } else if (sortValue === 'etherBalance') {
      return data.sort((a, b) => {
        return a.etherBalance.value && b.etherBalance.value
          ? a.etherBalance.value > b.etherBalance.value
            ? -1
            : a.etherBalance.value < b.etherBalance.value
              ? 1
              : 0
          : 0;
      });
    } else if (sortValue === 'seller') {
      return data.sort((a, b) =>
        a.seller?.name && b.seller?.name
          ? a.seller.name > b.seller.name
            ? -1
            : a.seller.name < b.seller.name
              ? 1
              : 0
          : 0
      );
    } else if (sortValue === 'state') {
      return data.sort((a, b) => {
        return a.state && b.state ? (a.state > b.state ? -1 : a.state < b.state ? 1 : 0) : 0;
      });
    } else if (sortValue === 'title') {
      return data.sort((a, b) => (a.title > b.title ? -1 : a.title < b.title ? 1 : 0));
    } else return data;
  } else {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.tokenDeposits[0].transaction.timestamp > b.tokenDeposits[0].transaction.timestamp
          ? -1
          : a.tokenDeposits[0].transaction.timestamp < b.tokenDeposits[0].transaction.timestamp
            ? 1
            : 0
      );
    } else if (sortValue === 'etherBalance') {
      return data.sort((a, b) => {
        return a.etherBalance.value && b.etherBalance.value
          ? a.etherBalance.value < b.etherBalance.value
            ? -1
            : a.etherBalance.value > b.etherBalance.value
              ? 1
              : 0
          : 0;
      });
    } else if (sortValue === 'seller') {
      return data.sort((a, b) =>
        a.seller?.name && b.seller?.name
          ? a.seller.name < b.seller.name
            ? -1
            : a.seller.name > b.seller.name
              ? 1
              : 0
          : 0
      );
    } else if (sortValue === 'state') {
      return data.sort((a, b) => {
        return a.state && b.state ? (a.state < b.state ? -1 : a.state > b.state ? 1 : 0) : 0;
      });
    } else if (sortValue === 'title') {
      return data.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
    } else return data;
  }
};
