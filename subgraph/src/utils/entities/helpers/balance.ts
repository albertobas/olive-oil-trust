import { decimals } from '@amxx/graphprotocol-utils';
import { BigInt } from '@graphprotocol/graph-ts';
import { Balance } from '../../../generated/types/schema';

export function increaseBalance(balance: Balance, value: BigInt): void {
  if (balance.valueExact) {
    let valueExact = balance.valueExact!.plus(value);
    balance.valueExact = valueExact;
    balance.value = balance.value ? decimals.toDecimals(valueExact) : null;
    balance.save();
  }
}

export function decreaseBalance(balance: Balance, value: BigInt): void {
  if (balance.valueExact) {
    let valueExact = balance.valueExact!.minus(value);
    balance.valueExact = valueExact;
    balance.value = balance.value ? decimals.toDecimals(valueExact) : null;
    balance.save();
  }
}
