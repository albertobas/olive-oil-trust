import {
  NameSet,
  OwnershipTransferred
} from 'subgraph/src/generated/types/RetailerUpgradeableDataSource/RetailerUpgradeable';
import { ensureOwnershipTransferred } from 'subgraph/src/utils/entities/OwnershipTransferred';
import { ensureMemberContract, registerMemberName } from 'subgraph/src/utils/entities/MemberContract';

export function handleNameSet(event: NameSet): void {
  registerMemberName(event.address, event.params.name, 'Retailer');
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureMemberContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}
