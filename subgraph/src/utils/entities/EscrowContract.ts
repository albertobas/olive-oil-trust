import { Address } from '@graphprotocol/graph-ts';
import { Account, EscrowContract } from 'subgraph/src/generated/types/schema';

export function ensureEscrowContract(addr: Address): EscrowContract {
  let contract = EscrowContract.load(addr);
  if (contract === null) {
    contract = new EscrowContract(addr);
    let account = Account.load(addr);
    if (account === null) {
      account = new Account(addr);
      account.asEscrowContract = addr;
      account.save();
    }
    contract.asAccount = account.id;
    contract.save();
  }
  return contract;
}
