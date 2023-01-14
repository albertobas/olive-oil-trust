import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { TokenTypeInstructionsSet } from 'subgraph/src/generated/types/schema';
import { ensureTransaction } from 'subgraph/src/utils/entities/Transaction';
import { eventId } from 'subgraph/src/utils/helpers';
import { ensureTokenContract } from 'subgraph/src/utils/entities/TokenContract';
import { ensureTokenType } from 'subgraph/src/utils/entities/TokenType';
import { DependentTokenUpgradeable } from 'subgraph/src/generated/types/DependentTokenUpgradeableDataSource/DependentTokenUpgradeable';
import { registerInstruction } from 'subgraph/src/utils/entities/Instruction';

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
  let dependentTokenUpgradeable = DependentTokenUpgradeable.bind(event.address);
  let uriRes = dependentTokenUpgradeable.try_uri(BigInt.fromI32(1));
  tokenType.uri = uriRes.reverted ? 'null' : uriRes.value.replaceAll('{id}', tokenTypeId.toString());
  tokenType.save();
  instructionsSet.contract = contract.id;
  instructionsSet.emitter = contract.id;
  instructionsSet.tokenType = tokenType.id;
  instructionsSet.timestamp = event.block.timestamp;
  instructionsSet.transaction = transaction.id;
  instructionsSet.save();
}
