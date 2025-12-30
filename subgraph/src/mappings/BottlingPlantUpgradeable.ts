import {
  NameSet,
  OwnershipTransferred,
  TokenAncestrySet
} from '../generated/types/BottlingPlantUpgradeableDataSource/BottlingPlantUpgradeable';
import { ensureOwnershipTransferred } from '../utils/entities/OwnershipTransferred';
import { ensureMemberContract, registerMemberName } from '../utils/entities/MemberContract';
import { registerTokenAncestry } from '../utils/entities/Ancestor';

export function handleNameSet(event: NameSet): void {
  registerMemberName(event.address, event.params.name, 'BottlingPlant');
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let transfer = ensureOwnershipTransferred(event, event.params.previousOwner, event.params.newOwner);
  let contract = ensureMemberContract(event.address);
  contract.owner = transfer.owner;
  contract.save();
}

export function handleTokenAncestrySet(event: TokenAncestrySet): void {
  registerTokenAncestry(
    event.params.tokenTypeId,
    event.params.tokenId,
    event.params.tokenAddress,
    event.params.inputTokenAddresses,
    event.params.inputTokenTypeIds,
    event.params.inputTokenIds,
    event.params.inputTokenAmounts
  );
}
