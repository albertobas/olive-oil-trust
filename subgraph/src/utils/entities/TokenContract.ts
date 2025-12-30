import { Address } from '@graphprotocol/graph-ts';
import { Account, TokenContract } from '../../generated/types/schema';

export function ensureTokenContract(addr: Address): TokenContract {
  let contract = TokenContract.load(addr);
  if (contract === null) {
    contract = new TokenContract(addr);
    let account = Account.load(addr);
    if (account === null) {
      account = new Account(addr);
      account.asTokenContract = addr;
      account.save();
    }
    contract.asAccount = account.id;
    contract.save();
  }
  return contract;
}
