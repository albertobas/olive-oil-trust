import { decimals } from '@amxx/graphprotocol-utils';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { Token, TokenTransfer } from '../../generated/types/schema';
import { ensureTransaction } from '../../utils/entities/Transaction';
import { ensureTokenBalance } from '../../utils/entities/Balance';
import { eventId } from '../../utils/helpers';
import { decreaseBalance, increaseBalance } from '../../utils/entities/helpers/balance';

export function registerTokenTransfer(
  event: ethereum.Event,
  token: Token,
  operatorId: Bytes,
  fromId: Bytes,
  toId: Bytes,
  value: BigInt
): void {
  let id = eventId(event.transaction.hash, event.logIndex, token.identifier);
  let transfer = new TokenTransfer(id);
  let transaction = ensureTransaction(event.transaction.hash, event.block.timestamp, event.block.number);
  transfer.contract = token.contract;
  transfer.emitter = token.contract;
  transfer.operator = operatorId;
  transfer.timestamp = event.block.timestamp;
  transfer.token = token.id;
  transfer.transaction = transaction.id;
  transfer.value = decimals.toDecimals(value);
  transfer.valueExact = value;
  if (fromId == Address.zero()) {
    let totalSupply = ensureTokenBalance(token.id, token.contract, null);
    increaseBalance(totalSupply, value);
  } else {
    let balance = ensureTokenBalance(token.id, token.contract, fromId);
    decreaseBalance(balance, value);
    transfer.from = fromId;
    transfer.fromBalance = balance.id;
  }
  if (toId == Address.zero()) {
    let totalSupply = ensureTokenBalance(token.id, token.contract, null);
    decreaseBalance(totalSupply, value);
  } else {
    let balance = ensureTokenBalance(token.id, token.contract, toId);
    increaseBalance(balance, value);
    transfer.to = toId;
    transfer.toBalance = balance.id;
  }
  transfer.save();
}
