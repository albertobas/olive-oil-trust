import { Address } from '@graphprotocol/graph-ts';
import { MemberContract } from '../../generated/types/schema';
import { ensureAccount } from '../../utils/entities/Account';

export function ensureMemberContract(memberAddress: Address): MemberContract {
  let contract = MemberContract.load(memberAddress);
  if (contract === null) {
    let account = ensureAccount(memberAddress);
    account.asMemberContract = memberAddress;
    account.save();
    contract = new MemberContract(memberAddress);
    contract.asAccount = account.id;
    contract.owner = memberAddress;
    contract.save();
  }
  return contract;
}

export function registerMemberName(memberAddress: Address, name: string, role: string): void {
  let contract = ensureMemberContract(memberAddress);
  contract.name = name;
  contract.role = role;
  contract.save();
}
