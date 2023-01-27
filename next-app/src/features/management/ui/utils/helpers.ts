import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { BigNumber, Contract } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { IEscrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import {
  BottlingPlant,
  Certifier,
  DependentCreator,
  Distributor,
  IGroupedItems,
  IItem,
  IndependentCreator,
  IndustrialUnitSeller,
  ManufacturedUnitSeller,
  OliveGrower,
  OliveOilBottle,
  OliveOilBottleEscrow,
  OliveOilMill,
  Retailer,
  Role,
  Seller
} from 'next-app/src/features/shared/utils/interfaces';
import {
  IAddTokenTypeState,
  IBurnTokenState,
  ICertifyTokenTypeState,
  IFormikMakePayment,
  IMintTokenState,
  IPackTokenState
} from 'next-app/src/features/management/utils/interfaces';
import {
  isBottleManufacturer,
  isBottlingPlant,
  isOliveGrower,
  isOliveOilMill,
  isRetailer
} from 'next-app/src/shared/utils/constants';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { creatorRoles } from 'next-app/src/features/management/ui/utils/constants';

export const sortTokenTypeArray = (
  data: ITokenType[],
  sortValue: string | undefined,
  reverse: boolean
): ITokenType[] => {
  if (reverse) {
    if (sortValue === 'title') {
      return data.sort((a, b) =>
        a.metadata && b.metadata && a.metadata.title && b.metadata.title
          ? a.metadata.title > b.metadata.title
            ? -1
            : a.metadata.title < b.metadata.title
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.instructionsSetEvent && b.instructionsSetEvent
          ? a.instructionsSetEvent.transaction.timestamp > b.instructionsSetEvent.transaction.timestamp
            ? -1
            : a.instructionsSetEvent.transaction.timestamp < b.instructionsSetEvent.transaction.timestamp
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'numInstructions') {
      return data.sort((a, b) =>
        a.instructions && b.instructions
          ? a.instructions.length > b.instructions.length
            ? -1
            : a.instructions.length < b.instructions.length
            ? 1
            : 0
          : 0
      );
    } else return data;
  } else {
    if (sortValue === 'title') {
      return data.sort((a, b) =>
        a.metadata && b.metadata && a.metadata.title && b.metadata.title
          ? a.metadata.title < b.metadata.title
            ? -1
            : a.metadata.title > b.metadata.title
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.instructionsSetEvent && b.instructionsSetEvent
          ? a.instructionsSetEvent.transaction.timestamp < b.instructionsSetEvent.transaction.timestamp
            ? -1
            : a.instructionsSetEvent.transaction.timestamp > b.instructionsSetEvent.transaction.timestamp
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'numInstructions') {
      return data.sort((a, b) =>
        a.instructions && b.instructions
          ? a.instructions.length < b.instructions.length
            ? -1
            : a.instructions.length > b.instructions.length
            ? 1
            : 0
          : 0
      );
    } else return data;
  }
};

export const sortTokenArray = (data: IToken[], sortValue: string | undefined, reverse: boolean): IToken[] => {
  if (reverse) {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.mintingDate && b.mintingDate
          ? a.mintingDate < b.mintingDate
            ? -1
            : a.mintingDate > b.mintingDate
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'tokenType') {
      return data.sort((a, b) =>
        a.tokenType && b.tokenType
          ? a.tokenType.id > b.tokenType.id
            ? -1
            : a.tokenType.id < b.tokenType.id
            ? 1
            : 0
          : 0
      );
    } else return data;
  } else {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.mintingDate && b.mintingDate
          ? a.mintingDate > b.mintingDate
            ? -1
            : a.mintingDate < b.mintingDate
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'tokenType') {
      return data.sort((a, b) =>
        a.tokenType && b.tokenType
          ? a.tokenType.id < b.tokenType.id
            ? -1
            : a.tokenType.id > b.tokenType.id
            ? 1
            : 0
          : 0
      );
    } else return data;
  }
};

export const sortEscrowArray = (data: IEscrow[], sortValue: string | undefined, reverse: boolean): IEscrow[] => {
  if (reverse) {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.tokenDeposits[0].transaction.timestamp < b.tokenDeposits[0].transaction.timestamp
          ? -1
          : a.tokenDeposits[0].transaction.timestamp > b.tokenDeposits[0].transaction.timestamp
          ? 1
          : 0
      );
    } else return data;
  } else {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.tokenDeposits[0].transaction.timestamp > b.tokenDeposits[0].transaction.timestamp
          ? -1
          : a.tokenDeposits[0].transaction.timestamp < b.tokenDeposits[0].transaction.timestamp
          ? 1
          : 0
      );
    } else return data;
  }
};

export const sortCertificateArray = (
  data: ICertificate[],
  sortValue: string | undefined,
  reverse: boolean
): ICertificate[] => {
  if (reverse) {
    if (sortValue === 'id') {
      return data.sort((a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0));
    } else if (sortValue === 'identifier') {
      return data.sort((a, b) => (a.identifier > b.identifier ? -1 : a.identifier < b.identifier ? 1 : 0));
    } else return data;
  } else {
    if (sortValue === 'id') {
      return data.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    } else if (sortValue === 'identifier') {
      return data.sort((a, b) => (a.identifier < b.identifier ? -1 : a.identifier > b.identifier ? 1 : 0));
    } else return data;
  }
};

export async function transferMintedTokens(
  contract: Contract | null,
  tokens: IMintTokenState[] | null,
  isDependentCreator: boolean
): Promise<number> {
  if (contract) {
    if (tokens && tokens.length > 0) {
      const tokenIds: string[] = [];
      const tokenTypesIds: string[] = [];
      const tokenAmounts: number[] = [];
      if (isDependentCreator) {
        const inputTokenAddresses: string[][][] = [];
        const inputTokenTypeIds: string[][][] = [];
        const inputTokenIds: string[][][] = [];
        const inputTokenAmounts: number[][][] = [];
        for (let i = 0; i < tokens.length; i++) {
          inputTokenAddresses[i] = [];
          inputTokenTypeIds[i] = [];
          inputTokenIds[i] = [];
          inputTokenAmounts[i] = [];
          const { inputAddresses, inputAmounts, inputIds, inputTypeIds } = tokens[i];
          tokenIds.push(formatBytes32String(tokens[i].tokenIdentifier));
          tokenTypesIds.push(formatBytes32String(tokens[i].tokenTypeId));
          tokenAmounts.push(tokens[i].tokenAmount);
          if (inputAddresses && inputAmounts && inputIds && inputTypeIds) {
            for (let j = 0; j < inputAddresses.length; j++) {
              inputTokenAddresses[i] = inputAddresses;
              inputTokenAmounts[i] = inputAmounts;
              inputTokenTypeIds[i][j] = [];
              inputTokenIds[i][j] = [];
              for (let k = 0; k < inputIds[j].length; k++) {
                inputTokenTypeIds[i][j][k] = formatBytes32String(inputTypeIds[j][k]);
                inputTokenIds[i][j][k] = formatBytes32String(inputIds[j][k]);
              }
            }
          } else {
            throw new Error('Input token arrays do not exist');
          }
        }
        const data: {
          inputTokenAddresses: string[][];
          inputTokenTypeIds: string[][];
          inputTokenIds: string[][];
          inputTokenAmounts: number[][];
        }[] = [];

        for (let i = 0; i < inputTokenAddresses.length; i++) {
          data[i] = {
            inputTokenAddresses: inputTokenAddresses[i],
            inputTokenTypeIds: inputTokenTypeIds[i],
            inputTokenIds: inputTokenIds[i],
            inputTokenAmounts: inputTokenAmounts[i]
          };
        }
        if (tokens && tokens.length > 1) {
          await (contract as DependentCreator).mintBatch(tokenTypesIds, tokenIds, tokenAmounts, data);
        } else {
          await (contract as DependentCreator).mint(tokenTypesIds[0], tokenIds[0], tokenAmounts[0], data[0]);
        }
      } else {
        for (let i = 0; i < tokens.length; i++) {
          tokenIds.push(formatBytes32String(tokens[i].tokenIdentifier));
          tokenTypesIds.push(formatBytes32String(tokens[i].tokenTypeId));
          tokenAmounts.push(tokens[i].tokenAmount);
        }
        if (tokens && tokens.length > 1) {
          await (contract as IndependentCreator).mintBatch(tokenTypesIds, tokenIds, tokenAmounts);
        } else {
          await (contract as IndependentCreator).mint(tokenTypesIds[0], tokenIds[0], tokenAmounts[0]);
        }
      }
      return tokenIds.length;
    } else {
      throw new Error('There are no tokens to mint');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferTokenTypes(
  contract: Contract | null,
  tokenTypes: IAddTokenTypeState[] | null
): Promise<number> {
  if (contract) {
    if (tokenTypes && tokenTypes.length > 0) {
      const tokenTypesIds: string[] = [];
      const instructedAddresses: string[][] = [];
      const instructedIds: string[][] = [];
      const instructedAmounts: number[][] = [];
      for (let i = 0; i < tokenTypes.length; i++) {
        tokenTypesIds.push(formatBytes32String(tokenTypes[i].id));
        instructedAddresses.push(tokenTypes[i].instructedAddresses);
        instructedIds.push(tokenTypes[i].instructedIds.map((id) => formatBytes32String(id)));
        instructedAmounts.push(tokenTypes[i].instructedAmounts);
      }
      if (tokenTypes && tokenTypes.length > 1) {
        await (contract as DependentCreator).setTokenTypesInstructions(
          tokenTypesIds,
          instructedAddresses,
          instructedIds,
          instructedAmounts
        );
      } else {
        await (contract as DependentCreator).setTokenTypeInstructions(
          tokenTypesIds[0],
          instructedAddresses[0],
          instructedIds[0],
          instructedAmounts[0]
        );
      }
      return tokenTypesIds.length;
    } else {
      throw new Error('There are no token types to submit');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferCertifiedTokenTypes(
  contract: Contract | null,
  certificates: ICertifyTokenTypeState[] | null
): Promise<number> {
  if (contract) {
    if (certificates && certificates.length > 0) {
      const certificateIds: string[] = [];
      const tokenAddresses: string[] = [];
      const tokenTypeIds: string[] = [];
      for (let i = 0; i < certificates.length; i++) {
        tokenAddresses.push(...certificates[i].tokenAddresses);
        for (let j = 0; j < certificates[i].tokenAddresses.length; j++) {
          certificateIds.push(formatBytes32String(certificates[i].certificateId));
          tokenTypeIds.push(formatBytes32String(certificates[i].tokenTypeIds[j]));
        }
      }
      if (certificateIds.length > 0 && tokenAddresses.length > 0 && tokenTypeIds.length > 0) {
        if (certificateIds.length > 1) {
          await (contract as Certifier).certifyBatch(certificateIds, tokenAddresses, tokenTypeIds);
        } else {
          await (contract as Certifier).certifyToken(certificateIds[0], tokenAddresses[0], tokenTypeIds[0]);
        }
        return certificateIds.length;
      } else {
        throw new Error('Certify method is getting one or more empty arrays');
      }
    } else {
      throw new Error('There are no cert to mint');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferMakeOffer(
  contract: Contract | null,
  escrow: IEscrow,
  price: string,
  buyerWallet: string
): Promise<void> {
  if (contract) {
    if (escrow.contract) {
      await (contract as OliveOilMill).makeOffer(escrow.contract, escrow.identifier, buyerWallet, { value: price });
    } else {
      throw new Error('The address of the escrow is nod specified');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferMakePayment(
  signedMemberContract: Contract | null,
  signedEscrowContract: Contract | null,
  escrow: IEscrow,
  moduleId: Module | null,
  { buyerWallet }: IFormikMakePayment
): Promise<void> {
  if (escrow.contract && escrow.price) {
    const nullContractMessage = 'An abstraction of the contract could not be created';
    if (moduleId) {
      if (moduleId === 'BottlingPlantUpgradeable') {
        if (signedMemberContract) {
          await (signedMemberContract as BottlingPlant).makePayment(escrow.contract, escrow.identifier, buyerWallet, {
            value: escrow.price.toString()
          });
        } else {
          throw new Error(nullContractMessage);
        }
      } else if (moduleId === 'DistributorUpgradeable') {
        if (signedMemberContract) {
          await (signedMemberContract as Distributor).makePayment(escrow.contract, escrow.identifier, buyerWallet, {
            value: escrow.price.toString()
          });
        } else {
          throw new Error(nullContractMessage);
        }
      } else {
        if (signedMemberContract) {
          await (signedMemberContract as Retailer).makePayment(escrow.contract, escrow.identifier, buyerWallet, {
            value: escrow.price.toString()
          });
        } else {
          throw new Error(nullContractMessage);
        }
      }
    } else {
      if (signedEscrowContract) {
        await (signedEscrowContract as OliveOilBottleEscrow).makePayment(escrow.identifier, buyerWallet, {
          value: escrow.price.toString()
        });
      } else {
        throw new Error(nullContractMessage);
      }
    }
  } else {
    throw new Error('The address of the escrow is nod specified');
  }
}

export async function transferBurnTokens(
  contract: Contract | null,
  tokens: IBurnTokenState[] | null,
  isSeller: boolean,
  accountAddress?: string
): Promise<number> {
  if (contract) {
    if (tokens && tokens.length > 0) {
      const tokenAddresses: string[] = [];
      const tokenTypeIds: string[] = [];
      const tokenIds: string[] = [];
      const tokenAmounts: number[] = [];
      for (let i = 0; i < tokens.length; i++) {
        const type = tokens[i].tokenTypeId;
        tokenAddresses.push(tokens[i].tokenAddress);
        if (type) {
          tokenTypeIds.push(formatBytes32String(type));
        }
        tokenIds.push(formatBytes32String(tokens[i].tokenIdentifier));
        tokenAmounts.push(tokens[i].tokenAmount);
      }
      if (isSeller) {
        if (tokens && tokens.length > 1) {
          await (contract as Seller).burnBatch(tokenAddresses[0], tokenTypeIds, tokenIds, tokenAmounts);
        } else {
          await (contract as Seller).burn(tokenAddresses[0], tokenTypeIds[0], tokenIds[0], tokenAmounts[0]);
        }
      } else {
        if (accountAddress) {
          if (tokens && tokens.length > 1) {
            await (contract as OliveOilBottle).burnBatch(accountAddress, tokenTypeIds, tokenIds, tokenAmounts);
          } else {
            await (contract as OliveOilBottle).burn(accountAddress, tokenTypeIds[0], tokenIds[0], tokenAmounts[0]);
          }
        } else {
          throw new Error('The user address is not defined');
        }
      }
      return tokenAddresses.length;
    } else {
      throw new Error('There are no tokens to burn');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferPackTokens(
  contract: Contract | null,
  tokens: IPackTokenState[] | null,
  isDistributor: boolean
): Promise<number> {
  if (contract) {
    if (tokens && tokens.length > 0) {
      const packIds: string[] = [];
      const tokenAddresses: string[][] = [];
      const tokenTypeIds: string[][] = [];
      const tokenIds: string[][] = [];
      const tokenAmounts: BigNumber[][] = [];
      for (let i = 0; i < tokens.length; i++) {
        packIds.push(formatBytes32String(tokens[i].packId));
        tokenAddresses[i] = [];
        tokenTypeIds[i] = [];
        tokenIds[i] = [];
        tokenAmounts[i] = [];
        for (let j = 0; j < tokens[i].tokenIds.length; j++) {
          const addresses = tokens[i].tokenAddresses;
          const type = tokens[i].tokenTypeIds[j];
          if (addresses) {
            tokenAddresses[i].push(addresses[j]);
          }
          if (type) {
            tokenTypeIds[i].push(formatBytes32String(type));
          }
          tokenIds[i].push(formatBytes32String(tokens[i].tokenIds[j]));
          tokenAmounts[i].push(BigNumber.from(tokens[i].tokenAmounts[j]));
        }
      }
      if (isDistributor) {
        if (tokens && tokens.length > 1) {
          await (contract as Distributor).packBatch(packIds, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
        } else {
          await (contract as Distributor).pack(
            packIds[0],
            tokenAddresses[0],
            tokenTypeIds[0],
            tokenIds[0],
            tokenAmounts[0]
          );
        }
      } else {
        if (tokens && tokens.length > 1) {
          await (contract as BottlingPlant).packBatch(packIds, tokenTypeIds, tokenIds, tokenAmounts);
        } else {
          await (contract as BottlingPlant).pack(packIds[0], tokenTypeIds[0], tokenIds[0], tokenAmounts[0]);
        }
      }
      return packIds.length;
    } else {
      throw new Error('There are no tokens to pack');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferUnpackTokens(
  contract: Contract | null,
  ids: string[] | null,
  tokenAddresses: string[],
  tokenIds: string[],
  unpacker: 'BottlingPlant' | 'Distributor' | 'Retailer'
): Promise<number> {
  if (contract) {
    if (ids && tokenAddresses.length > 0 && tokenIds.length > 0) {
      const isBottlingPlant = unpacker === 'BottlingPlant';
      const isDistributor = unpacker === 'Distributor';

      if (isBottlingPlant) {
        if (ids.length > 1) {
          await (contract as BottlingPlant).unpackBatch(tokenIds);
        } else {
          await (contract as BottlingPlant).unpack(tokenIds[0]);
        }
      } else if (isDistributor) {
        if (ids.length > 1) {
          await (contract as Distributor).unpackBatch(tokenAddresses[0], tokenIds);
        } else {
          await (contract as Distributor).unpack(tokenAddresses[0], tokenIds[0]);
        }
      } else {
        if (ids.length > 1) {
          await (contract as Retailer).unpackBatch(tokenAddresses[0], tokenIds);
        } else {
          await (contract as Retailer).unpack(tokenAddresses[0], tokenIds[0]);
        }
      }
      return tokenIds.length;
    } else {
      throw new Error('Unpack method is getting one or more empty arrays');
    }
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export async function transferDepositTokens(
  contract: Contract | null,
  price: string,
  sellerWallet: string,
  tokenAddresses: string[],
  tokenTypeIds: string[],
  tokenIds: string[],
  tokenAmounts: number[],
  isOliveGrower: boolean,
  isManufacturedUnitSeller: boolean,
  isIndustrialUnitSeller: boolean
): Promise<number> {
  if (contract) {
    if (isOliveGrower) {
      if (tokenAddresses.length > 0 && tokenTypeIds.length > 0 && tokenIds.length > 0 && tokenAmounts.length > 0) {
        if (tokenAddresses.length > 1) {
          await (contract as OliveGrower).depositBatch(tokenTypeIds, tokenIds, tokenAmounts, sellerWallet);
        } else {
          await (contract as OliveGrower).depositToken(tokenTypeIds[0], tokenIds[0], tokenAmounts[0], sellerWallet);
        }
      } else {
        throw new Error('Deposit method is getting one or more empty arrays');
      }
    } else {
      if (price.length) {
        if (isIndustrialUnitSeller) {
          if (tokenIds.length > 1) {
            await (contract as IndustrialUnitSeller).depositBatch(tokenIds, price, sellerWallet);
          } else {
            await (contract as IndustrialUnitSeller).depositToken(tokenIds[0], price, sellerWallet);
          }
        } else {
          if (tokenTypeIds.length > 0 && tokenIds.length > 0 && tokenAmounts.length > 0) {
            if (isManufacturedUnitSeller) {
              if (tokenIds.length > 1) {
                await (contract as ManufacturedUnitSeller).depositBatch(
                  tokenTypeIds,
                  tokenIds,
                  tokenAmounts,
                  price,
                  sellerWallet
                );
              } else {
                await (contract as ManufacturedUnitSeller).depositToken(
                  tokenTypeIds[0],
                  tokenIds[0],
                  tokenAmounts[0],
                  price,
                  sellerWallet
                );
              }
            } else {
              if (tokenAddresses.length > 0) {
                if (tokenIds.length > 1) {
                  await (contract as Retailer).depositBatch(
                    tokenAddresses[0],
                    tokenTypeIds,
                    tokenIds,
                    tokenAmounts,
                    price,
                    sellerWallet
                  );
                } else {
                  await (contract as Retailer).depositToken(
                    tokenAddresses[0],
                    tokenTypeIds[0],
                    tokenIds[0],
                    tokenAmounts[0],
                    price,
                    sellerWallet
                  );
                }
              }
            }
          } else {
            throw new Error('Deposit method is getting one or more empty arrays');
          }
        }
      } else {
        throw new Error('Price is not defined');
      }
    }
    return tokenIds.length;
  } else {
    throw new Error('An abstraction of the contract could not be created');
  }
}

export function getGroupedTokensByType(tokens: IToken[], filter?: string[]): IGroupedItems[] | null {
  const groupedItems: IGroupedItems[] = [];
  const tokensByType = tokens.reduce((acc, { id, identifier, tokenType }) => {
    if (tokenType) {
      const { metadata } = tokenType;
      const label = `${tokenType.identifier}${metadata && metadata.title ? ` - ${metadata.title}` : ''}`;
      const optsLabel = `Batch ${identifier}`;
      const options = { label: optsLabel, value: id };
      if (filter) {
        if (filter.includes(tokenType.id)) {
          acc[tokenType.id] ??= { label, options: [] };
          acc[tokenType.id].options.push(options);
        }
      } else {
        acc[tokenType.id] ??= { label, options: [] };
        acc[tokenType.id].options.push(options);
      }
    }
    return acc;
  }, {} as Record<string, { label: string; options: IItem[] }>);

  for (const type of Object.keys(tokensByType)) {
    const { label, options } = tokensByType[type];
    if (options) {
      groupedItems.push({ label, options });
    }
  }
  return groupedItems.length ? groupedItems : null;
}

export function getGroupedTokenTypesByRole(tokenTypes: ITokenType[]): IGroupedItems[] {
  const groupedItems: IGroupedItems[] = [];
  const tokenTypesByRole = tokenTypes.reduce((acc, { id, identifier, metadata, member }) => {
    if (member && member.role) {
      acc[member.role] ??= [];
      acc[member.role].push({
        label: metadata && metadata.title ? `${identifier} (${metadata.title})` : identifier,
        value: id
      });
    }
    return acc;
  }, {} as Record<string, IItem[]>);

  for (const roleItem of creatorRoles) {
    const options = tokenTypesByRole[roleItem.value];
    if (options) {
      groupedItems.push({ label: roleItem.label, options: options });
    }
  }
  return groupedItems;
}

export function getTokenNameFromModule(moduleId: Module): string | null {
  return isOliveGrower(moduleId)
    ? 'Olives'
    : isBottleManufacturer(moduleId)
    ? 'Bottles'
    : isOliveOilMill(moduleId)
    ? 'Olive Oil'
    : isBottlingPlant(moduleId) || isRetailer(moduleId)
    ? 'Olive Oil Bottles'
    : null;
}

export function getTokenUnitFromModule(moduleId: Module): string {
  return isOliveGrower(moduleId) ? 'kg' : isOliveOilMill(moduleId) ? 'l' : 'units';
}

export function getTokenUnitFromRole(role: Role): string {
  return role === 'OliveGrower' ? 'kg' : role === 'OliveOilMill' ? 'l' : 'units';
}

export function getInstuctionTokenUnitFromModule(moduleId: Module): string {
  return isOliveGrower(moduleId) ? 'kg/l' : isOliveOilMill(moduleId) ? 'ml/unit' : 'unit/s';
}

export function getInstuctionTokenUnitFromRole(role: Role): string {
  return role === 'OliveGrower' ? 'kg/l' : role === 'OliveOilMill' ? 'ml/unit' : 'unit/s';
}

export function getModuleFromRole(role: Role): Module {
  return (role + 'Upgradeable') as Module;
}
