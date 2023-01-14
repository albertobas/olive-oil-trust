import { Address } from '@graphprotocol/graph-ts';
import { Account, CertificateContract } from 'subgraph/src/generated/types/schema';

export function ensureCertificateContract(addr: Address): CertificateContract {
  let contract = CertificateContract.load(addr);
  if (contract === null) {
    contract = new CertificateContract(addr);
    let account = Account.load(addr);
    if (account === null) {
      account = new Account(addr);
      account.asCertificateContract = addr;
      account.save();
    }
    contract.asAccount = account.id;
    contract.save();
  }
  return contract;
}
