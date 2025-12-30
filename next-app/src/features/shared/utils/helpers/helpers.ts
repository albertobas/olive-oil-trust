import { roles } from '@shared/utils/constants';
import { Module } from '@shared/utils/interfaces';
import { Certificate } from '@features/shared/core/entities/Certificates';
import { Escrow } from '@features/shared/core/entities/Escrows';
import { Event, Transaction } from '@features/shared/core/entities/Events';
import { Token } from '@features/shared/core/entities/Tokens';
import { TokenType } from '@features/shared/core/entities/TokenTypes';
import {
  Role,
  EscrowSate,
  IItem,
  FilterOption,
  EventRawType,
  TransactionRawType
} from '@features/shared/utils/interfaces';

export function checkRole(role: string): Role | null {
  return role === 'OliveGrower'
    ? 'OliveGrower'
    : role === 'BottleManufacturer'
      ? 'BottleManufacturer'
      : role === 'OliveOilMill'
        ? 'OliveOilMill'
        : role === 'BottlingPlant'
          ? 'BottlingPlant'
          : role === 'Distributor'
            ? 'Distributor'
            : role === 'Retailer'
              ? 'Retailer'
              : null;
}

export function checkModule(role: string): Module | null {
  return role === 'OliveGrower'
    ? 'OliveGrowerUpgradeable'
    : role === 'BottleManufacturer'
      ? 'BottleManufacturerUpgradeable'
      : role === 'OliveOilMill'
        ? 'OliveOilMillUpgradeable'
        : role === 'BottlingPlant'
          ? 'BottlingPlantUpgradeable'
          : role === 'Distributor'
            ? 'DistributorUpgradeable'
            : role === 'Retailer'
              ? 'RetailerUpgradeable'
              : null;
}
export function checkEscrowState(state: string): EscrowSate | null {
  return state === 'NonActive'
    ? 'NonActive'
    : state === 'Active'
      ? 'Active'
      : state === 'RevertedBeforePayment'
        ? 'RevertedBeforePayment'
        : state === 'EtherDeposited'
          ? 'EtherDeposited'
          : state === 'RevertedAfterPayment'
            ? 'RevertedAfterPayment'
            : state === 'Closed'
              ? 'Closed'
              : null;
}

export function getEscrowState(state: EscrowSate): string | null {
  return state === 'NonActive'
    ? 'Non Active'
    : state === 'Active'
      ? 'Active'
      : state === 'RevertedBeforePayment'
        ? 'Reverted Before Payment'
        : state === 'EtherDeposited'
          ? 'Ether Deposited'
          : state === 'RevertedAfterPayment'
            ? 'Reverted After Payment'
            : state === 'Closed'
              ? 'Closed'
              : null;
}
export const getTime = (): number => {
  // return time in seconds
  return new Date().getTime() / 1000;
};

export const getUTCFromTimestamp = (date: number): string => {
  return new Date(date * 1000).toUTCString();
};

export function parseEvent({ id, emitter, transaction }: EventRawType): Event {
  return {
    id,
    emitter: emitter.id,
    transaction: parseTransaction(transaction)
  };
}

export function parseTransaction({ id, blockNumber, timestamp }: TransactionRawType): Transaction {
  return { id, blockNumber: parseInt(blockNumber), timestamp: parseInt(timestamp) };
}

export function tokenTypeFilter(types: TokenType[] | null, options: FilterOption[]): TokenType[] | null {
  function booleanFilter(value: string | undefined, filter: IItem | IItem[]) {
    const itemsArray: boolean[] = [];
    value &&
      filter &&
      (Array.isArray(filter)
        ? filter.map((filterItem) => {
            itemsArray.push(value === filterItem.value);
          })
        : itemsArray.push(value === filter.value));
    return itemsArray;
  }
  function typeMap({ member }: TokenType) {
    return options.map((option) => {
      return (
        Boolean(
          option.items &&
          (Array.isArray(option.items) ? option.items.length > 0 : true) &&
          option.key === 'member' &&
          member &&
          booleanFilter(member.role ?? '', option.items).reduce((a, b) => {
            return a || b;
          }, false)
        ) || !option.items
      );
    });
  }
  return types
    ? types.filter((type) =>
        typeMap(type).reduce((a, b) => {
          return a && b;
        }, true)
      )
    : null;
}

export function tokenFilter(tokens: Token[] | null, options: FilterOption[]): Token[] | null {
  function booleanFilter(value: string | undefined, filter: IItem | IItem[]) {
    const itemsArray: boolean[] = [];
    value &&
      filter &&
      (Array.isArray(filter)
        ? filter.map((filterItem) => {
            itemsArray.push(value === filterItem.value);
          })
        : itemsArray.push(value === filter.value));
    return itemsArray;
  }
  function tokenMap({ industrialUnitTokenInfo, tokenType, selfProduced }: Token) {
    return options.map((option) => {
      return (
        Boolean(
          option.items &&
          (Array.isArray(option.items) ? option.items.length > 0 : true) &&
          (option.key === 'packer' ||
            option.key === 'type' ||
            option.key === 'manufacturer' ||
            option.key === 'selfProduced') &&
          booleanFilter(
            option.key === 'packer'
              ? (industrialUnitTokenInfo?.member?.name ?? '')
              : option.key === 'type'
                ? (tokenType?.identifier ?? '')
                : option.key === 'manufacturer'
                  ? (tokenType?.member?.name ?? '')
                  : selfProduced
                    ? 'yes'
                    : 'no',
            option.items
          ).reduce((a, b) => {
            return a || b;
          }, false)
        ) || !option.items
      );
    });
  }
  return tokens
    ? tokens.filter((token) =>
        tokenMap(token).reduce((a, b) => {
          return a && b;
        }, true)
      )
    : null;
}

export function escrowFilter(escrows: Escrow[] | null, options: FilterOption[]): Escrow[] | null {
  function booleanFilter(value: string | undefined, filter: IItem | IItem[]) {
    const itemsArray: boolean[] = [];
    value &&
      filter &&
      (Array.isArray(filter)
        ? filter.map((filterItem) => {
            itemsArray.push(value === filterItem.value);
          })
        : itemsArray.push(value === filter.value));
    return itemsArray;
  }
  function escrowMap({ buyer, seller, state }: Escrow) {
    return options.map((option) => {
      return (
        Boolean(
          option.items &&
          (Array.isArray(option.items) ? option.items.length > 0 : true) &&
          (option.key === 'buyer' || option.key === 'seller' || option.key === 'state') &&
          booleanFilter(
            option.key === 'buyer'
              ? (buyer?.name ?? buyer?.id ?? '')
              : option.key === 'seller'
                ? (seller?.name ?? '')
                : (state ?? ''),
            option.items
          ).reduce((a, b) => {
            return a || b;
          }, false)
        ) || !option.items
      );
    });
  }
  return escrows
    ? escrows.filter((escrow) =>
        escrowMap(escrow).reduce((a, b) => {
          return a && b;
        }, true)
      )
    : null;
}

export function tokenSearch(data: Token[] | null, query: string | null): Token[] | null {
  if (data) {
    if (query) {
      const query_ = query.toLowerCase();
      return data.filter(
        (token) => token.id.toLowerCase().indexOf(query_) > -1 || token.title.toLowerCase().indexOf(query_) > -1
      );
    }
    return data;
  }
  return null;
}

export function certificateSearch(data: Certificate[] | null, query: string | null): Certificate[] | null {
  if (data) {
    if (query) {
      const query_ = query.toLowerCase();
      return data.filter(
        (certificate) =>
          certificate.id.toLowerCase().indexOf(query_) > -1 || certificate.identifier.toLowerCase().indexOf(query_) > -1
      );
    }
    return data;
  }
  return null;
}

export function tokenTypeSearch(data: TokenType[] | null, query: string | null): TokenType[] | null {
  if (data) {
    if (query) {
      const query_ = query.toLowerCase();
      return data.filter(
        (type) =>
          type.id.toLowerCase().indexOf(query_) > -1 ||
          type.identifier.toLowerCase().indexOf(query_) > -1 ||
          (type.metadata &&
            ((type.metadata.title && type.metadata.title.toLowerCase().indexOf(query_) > -1) ||
              (type.metadata.description && type.metadata.description.toLowerCase().indexOf(query_) > -1) ||
              (type.metadata.bottle &&
                ((type.metadata.bottle.material && type.metadata.bottle.material.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.bottle.quality && type.metadata.bottle.quality.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.bottle.size &&
                    type.metadata.bottle.size.toString().toLowerCase().indexOf(query_) > -1))) ||
              (type.metadata.olive &&
                ((type.metadata.olive.origin && type.metadata.olive.origin.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.olive.quality && type.metadata.olive.quality.toLowerCase().indexOf(query_) > -1))) ||
              (type.metadata.oliveOil &&
                ((type.metadata.oliveOil.acidity &&
                  type.metadata.oliveOil.acidity.toString().toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.oliveOil.aroma && type.metadata.oliveOil.aroma.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.oliveOil.bitterness &&
                    type.metadata.oliveOil.bitterness.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.oliveOil.colour && type.metadata.oliveOil.colour.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.oliveOil.fruitness &&
                    type.metadata.oliveOil.fruitness.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.oliveOil.intensity &&
                    type.metadata.oliveOil.intensity.toLowerCase().indexOf(query_) > -1) ||
                  (type.metadata.oliveOil.itching &&
                    type.metadata.oliveOil.itching.toLowerCase().indexOf(query_) > -1)))))
      );
    }
    return data;
  }
  return null;
}

export function escrowSearch(data: Escrow[] | null, query: string | null): Escrow[] | null {
  if (data) {
    if (query) {
      const query_ = query.toLowerCase();
      return data.filter(
        (escrow) =>
          escrow.id.toLowerCase().indexOf(query_) > -1 || escrow.title.toString().toLowerCase().indexOf(query_) > -1
      );
    }
    return data;
  }
  return null;
}

const sortItemArray = (a: IItem, b: IItem) => {
  const itemA = a.label.toLowerCase();
  const itemB = b.label.toLowerCase();
  if (itemA < itemB) {
    return -1;
  }
  if (itemA > itemB) {
    return 1;
  }
  return 0;
};

export function getItemsFromTokens(
  data: Token[] | string,
  key: 'selfProduced' | 'manufacturer' | 'packer' | 'type'
): IItem[] | null {
  const getKeySet = (
    data: Token[] | string,
    key: 'selfProduced' | 'manufacturer' | 'packer' | 'type'
  ): string[] | null => {
    const keySet = [];
    if (typeof data === 'string') {
      keySet.push(...new Set(data.split(',').flat()));
    } else if (Array.isArray(data)) {
      const source: string[] = [];
      data.forEach(function ({ tokenType, industrialUnitTokenInfo }) {
        if (key === 'manufacturer') {
          const member = tokenType?.member ?? null;
          source.push(member?.name ?? '');
        } else if (key === 'packer') {
          const member = industrialUnitTokenInfo?.member ?? null;
          source.push(member?.name ?? '');
        } else if (key === 'type') {
          const identifier = tokenType?.identifier ?? null;
          source.push(identifier ?? '');
        }
      });
      keySet.push(...new Set(source.flat()));
    } else return null;
    return keySet;
  };
  const keySet = getKeySet(data, key);
  const typeItemsArray: IItem[] = [];
  if (keySet) {
    keySet.forEach(function (item) {
      if (item.length) {
        typeItemsArray.push({
          label: item,
          value: item
        });
      }
    });
  } else return null;
  return typeItemsArray.length ? typeItemsArray.sort(sortItemArray) : null;
}

export function getItemsFromEscrows(data: Escrow[] | string, key: keyof Escrow): IItem[] | null {
  const getKeySet = (data: Escrow[] | string, key: keyof Escrow): string[] | null => {
    const keySet = [];
    if (typeof data === 'string') {
      keySet.push(...new Set(data.split(',').flat()));
    } else if (Array.isArray(data)) {
      const source: string[] = [];
      data.forEach(function (escrow) {
        if (key === 'state') {
          source.push(escrow.state ?? '');
        } else if (key === 'seller') {
          source.push(escrow.seller?.name ?? '');
        } else if (key === 'buyer') {
          source.push(escrow.buyer ? (escrow.buyer.name ?? escrow.buyer.id) : '');
        }
      });
      keySet.push(...new Set(source.flat()));
    } else return null;
    return keySet;
  };
  const keySet = getKeySet(data, key);
  const typeItemsArray: IItem[] = [];
  if (keySet) {
    keySet.forEach(function (item) {
      if (item.length) {
        typeItemsArray.push({
          label: item,
          value: item
        });
      }
    });
  } else return null;
  return typeItemsArray.length ? typeItemsArray.sort(sortItemArray) : null;
}

export function getItemsFromTypes(data: TokenType[] | string, key: keyof TokenType): IItem[] | null {
  const getKeySet = (data: TokenType[] | string, key: keyof TokenType): string[] | null => {
    const keySet = [];
    if (typeof data === 'string') {
      keySet.push(...new Set(data.split(',').flat()));
    } else if (Array.isArray(data)) {
      const source: string[] = [];
      data.forEach(function (type) {
        if (key === 'member') {
          const member = type[key];
          source.push(member?.role ?? '');
        }
      });
      keySet.push(...new Set(source.flat()));
    } else return null;
    return keySet;
  };
  const keySet = getKeySet(data, key);
  const typeItemsArray: IItem[] = [];
  if (keySet) {
    if (key === 'member') {
      keySet.forEach(function (item) {
        if (item.length) {
          typeItemsArray.push({
            label: roles[item as Role],
            value: item
          });
        }
      });
    } else return null;
  } else return null;
  return typeItemsArray ? typeItemsArray.sort(sortItemArray) : null;
}
