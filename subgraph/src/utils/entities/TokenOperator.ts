import { Address, ethereum } from '@graphprotocol/graph-ts';
import { TokenOperator } from '../../generated/types/schema';
import { separator } from '../../utils/constants';
import { ensureAccount } from '../../utils/entities/Account';
import { ensureTokenContract } from '../../utils/entities/TokenContract';

export function registerApproval(
  event: ethereum.Event,
  accountAddress: Address,
  operatorAddrress: Address,
  isApproved: boolean
): void {
  let contract = ensureTokenContract(event.address);
  let operator = ensureAccount(operatorAddrress);
  let owner = ensureAccount(accountAddress);
  let id = contract.id.toHex().concat(separator).concat(owner.id.toHex()).concat(separator).concat(operator.id.toHex());
  let delegate = TokenOperator.load(id);
  if (delegate === null) {
    delegate = new TokenOperator(id);
    delegate.contract = contract.id;
    delegate.owner = owner.id;
    delegate.operator = operator.id;
  }
  delegate.approved = isApproved;
  delegate.save();
}
