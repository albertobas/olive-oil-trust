import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Escrow } from '../../generated/types/schema';
import { separator } from '../../utils/constants';
import { ensureEscrowBalance, ensureEtherBalance } from '../../utils/entities/Balance';
import { ensureEscrowContract } from '../../utils/entities/EscrowContract';
import { ensureAccount } from '../../utils/entities/Account';

export function ensureEscrow(escrowId: BigInt, escrowAddress: Address): Escrow {
  let contract = ensureEscrowContract(escrowAddress);
  let eventEscrowId = escrowId.toString();
  let id = escrowAddress.toHexString().concat(separator).concat(eventEscrowId);
  let escrow = Escrow.load(id);
  if (escrow === null) {
    let account = ensureAccount(escrowAddress);
    let etherBalance = ensureEtherBalance(id, contract.id);
    let escrowBalance = ensureEscrowBalance(id, contract.id, account);
    escrow = new Escrow(id);
    escrow.contract = contract.id;
    escrow.escrowId = escrowId;
    escrow.escrowBalance = escrowBalance.id;
    escrow.etherBalance = etherBalance.id;
    escrow.identifier = escrowId;
    escrow.save();
    account.asEscrowContract = contract.id;
    account.save();
  }
  return escrow;
}
