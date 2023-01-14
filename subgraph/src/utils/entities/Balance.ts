import { constants } from '@amxx/graphprotocol-utils';
import { Bytes } from '@graphprotocol/graph-ts';
import { Account, Balance } from 'subgraph/src/generated/types/schema';
import { separator } from 'subgraph/src/utils/constants';

export function ensureTokenBalance(tokenId: string, contractId: Bytes, accountId: Bytes | null): Balance {
  let tokenIdStr = tokenId.toString();
  let balanceId = contractId
    .toHex()
    .concat(separator)
    .concat(tokenIdStr)
    .concat(separator)
    .concat(accountId ? accountId.toHex() : 'totalSupply');
  let balance = Balance.load(balanceId);
  if (balance === null) {
    balance = new Balance(balanceId);
    if (accountId !== null) {
      balance.tokenAccount = accountId;
    }
    balance.tokenToken = tokenIdStr;
    balance.tokenTokenContract = contractId;
    balance.valueExact = constants.BIGINT_ZERO;
    balance.save();
  }
  return balance;
}

export function ensureEscrowBalance(escrowId: string, contractId: Bytes, account: Account): Balance {
  let balanceId = contractId.toHex().concat(separator).concat(escrowId);
  let balance = Balance.load(balanceId);
  if (balance === null) {
    balance = new Balance(balanceId);
    balance.escrowAccount = account.id;
    balance.escrowEscrow = escrowId;
    balance.escrowEscrowContract = contractId;
    balance.save();
    account.escrowBalance = balance.id;
    account.save();
  }
  return balance;
}

export function ensureEtherBalance(escrowId: string, contractId: Bytes): Balance {
  let balanceId = contractId.toHex().concat(separator).concat(escrowId).concat(separator).concat('ether');
  let balance = Balance.load(balanceId);
  if (balance === null) {
    balance = new Balance(balanceId);
    if (contractId !== null) {
      balance.escrowEscrowContract = contractId;
    }
    balance.escrowEscrow = escrowId;
    balance.value = constants.BIGDECIMAL_ZERO;
    balance.valueExact = constants.BIGINT_ZERO;
    balance.save();
  }
  return balance;
}
