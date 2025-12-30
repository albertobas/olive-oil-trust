import {
  NameSet,
  OwnershipTransferred
} from '../generated/types/OliveGrowerUpgradeableDataSource/OliveGrowerUpgradeable';
import { ensureOwnershipTransferred } from '../utils/entities/OwnershipTransferred';
import { ensureMemberContract, registerMemberName } from '../utils/entities/MemberContract';

export function handleNameSet(event: NameSet): void {
  registerMemberName(event.address, event.params.name, 'OliveGrower');
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureMemberContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
