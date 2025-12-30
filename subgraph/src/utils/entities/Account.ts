import { Address } from '@graphprotocol/graph-ts';
import { Account } from '../../generated/types/schema';

export function ensureAccount(addr: Address): Account {
  let account = Account.load(addr);
  if (account === null) {
    account = new Account(addr);
    account.save();
  }
  return account;
}
