import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { TokenTypeInstructionsSet } from '../../generated/types/schema';
import { ensureTransaction } from '../../utils/entities/Transaction';
import { eventId } from '../../utils/helpers';
import { ensureTokenContract } from '../../utils/entities/TokenContract';
import { ensureTokenType } from '../../utils/entities/TokenType';
import { registerInstruction } from '../../utils/entities/Instruction';

export function registerTokenTypeInstructionsSet(
  event: ethereum.Event,
  tokenTypeId: Bytes,
  instructedAddresses: Address[],
  instructedAmounts: BigInt[],
  instructedTokenTypeIds: Bytes[]
): void {
  let contract = ensureTokenContract(event.address);
  let tokenTypeInstructionsSetId = eventId(event.transaction.hash, event.logIndex, tokenTypeId.toHex());
  let instructionsSet = new TokenTypeInstructionsSet(tokenTypeInstructionsSetId);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  let tokenType = ensureTokenType(contract.id, tokenTypeId, event.block.timestamp);
  for (let i = 0; i < instructedAddresses.length; i++) {
    registerInstruction(
      i,
      tokenType,
      instructionsSet.id,
      instructedAddresses[i],
      instructedAmounts[i],
      instructedTokenTypeIds[i]
    );
  }
  tokenType.tokenTypeInstructionsSet = instructionsSet.id;
  tokenType.save();
  instructionsSet.contract = contract.id;
  instructionsSet.emitter = contract.id;
  instructionsSet.tokenType = tokenType.id;
  instructionsSet.timestamp = event.block.timestamp;
  instructionsSet.transaction = transaction.id;
  instructionsSet.save();
}
