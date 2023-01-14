import { roles } from 'next-app/src/shared/utils/constants';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { ICertificateOOT } from 'next-app/src/features/shared/core/entities/CertificatesOOT';
import { IEscrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { IEscrowOOT } from 'next-app/src/features/shared/core/entities/EscrowsOOT';
import { IEvent, ITransaction } from 'next-app/src/features/shared/core/entities/Events';
import { IEventOOT, ITransactionOOT } from 'next-app/src/features/shared/core/entities/EventsOOT';
import { IMetadata } from 'next-app/src/features/shared/core/entities/Metadata';
import {
  IFirstAncestry,
  IIndustrialUnitTokenInfo,
  ISecondAncestry,
  IToken,
  ITokenFields,
  ITokenFirstAncestry,
  ITokensInfo
} from 'next-app/src/features/shared/core/entities/Tokens';
import {
  IBasicTokenFieldsOOT,
  IIndustrialUnitTokenInfoOOT,
  ITokenOOT
} from 'next-app/src/features/shared/core/entities/TokensOOT';
import { ITokenType, ITokenTypeInstruction } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { ITokenTypeInstructionOOT, ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';
import {
  Role,
  EscrowSate,
  IMemberOOT,
  IMember,
  IItem,
  FilterOption
} from 'next-app/src/features/shared/utils/interfaces';

function checkRole(role: string): Role | null {
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
function checkModule(role: string): Module | null {
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
function checkEscrowState(state: string): EscrowSate | null {
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
  //return time in seconds
  return new Date().getTime() / 1000;
};

export const getUTCFromTimestamp = (date: number): string => {
  return new Date(date * 1000).toUTCString();
};

export function getTokenType(type: ITokenTypeOOT): ITokenType {
  return {
    id: type.id,
    certificates:
      type.certificates && type.certificates.length > 0
        ? type.certificates.map((certificate) => getCertificate(certificate.certificate))
        : null,
    contract: type.contract ? type.contract.id : null,
    creationDate: parseInt(type.creationDate),
    identifier: type.identifier,
    instructions: getTokenTypeInstructions(type.instructions),
    instructionsSetEvent: type.tokenTypeInstructionsSet ? parseEvent(type.tokenTypeInstructionsSet) : null,
    metadata: getMetadata(type),
    member:
      type.contract && type.contract.owner && type.contract.owner.asMemberContract
        ? getMember(type.contract.owner.asMemberContract)
        : null,
    uri: type.uri
  };
}

export function getTokenTypeInstructions(
  instructionsOOT: ITokenTypeInstructionOOT[] | null | undefined
): ITokenTypeInstruction[] | null {
  if (instructionsOOT && instructionsOOT.length > 0) {
    const instructions: ITokenTypeInstruction[] = [];
    for (let i = 0; i < instructionsOOT.length; i++) {
      const instruction = instructionsOOT[i];
      const tokenTypeOrCertificateId = instruction.instructedCertificate
        ? instruction.instructedCertificate.id
        : instruction.instructedTokenType
        ? instruction.instructedTokenType.id
        : null;
      const tokenTypeOrCertificateTitle = instruction.instructedCertificate
        ? instruction.instructedCertificate.title
        : instruction.instructedTokenType
        ? instruction.instructedTokenType.title
        : null;
      if (tokenTypeOrCertificateId && tokenTypeOrCertificateTitle) {
        const certificateTokenTypeRole = instruction.instructedCertificate
          ? instruction.instructedCertificate.tokenTypes
            ? instruction.instructedCertificate.tokenTypes[0].tokenType.contract.owner?.asMemberContract?.role ?? null
            : null
          : null;
        const tokenTypeRole = instruction.instructedTokenType?.contract.owner?.asMemberContract?.role ?? null;
        instructions.push({
          amount: instruction.instructedTokenAmount ? parseInt(instruction.instructedTokenAmount) : null,
          instructorModuleId: certificateTokenTypeRole
            ? checkModule(certificateTokenTypeRole)
            : tokenTypeRole
            ? checkModule(tokenTypeRole)
            : null,
          id: tokenTypeOrCertificateId,
          isCertificate: instruction.instructedCertificate ? true : false,
          title: tokenTypeOrCertificateTitle,
          certifiedTokenTypes: instruction.instructedCertificate
            ? instruction.instructedCertificate.tokenTypes
              ? instruction.instructedCertificate.tokenTypes.map((type) => {
                  return { id: type.tokenType.id, title: type.tokenType.title };
                })
              : null
            : null
        });
      }
    }
    return instructions;
  }
  return null;
}

export function getTokensInfo(
  amounts: string[] | null,
  tokens: ITokenOOT[] | null,
  selfProducedIds: string[] | null
): ITokensInfo | null {
  let tokensInfo: ITokensInfo | null = null;
  if (amounts && tokens) {
    tokensInfo = {};
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      tokensInfo[token.id] = {
        amount: parseInt(amounts[i]),
        token: {
          id: token.id,
          contract: token.contract.id,
          tokenType: token.tokenType ? getTokenType(token.tokenType) : null,
          identifier: token.identifier,
          industrialUnitTokenInfo: token.industrialUnitTokenInfo
            ? getIndustrialUnitTokenInfo(token.industrialUnitTokenInfo, selfProducedIds)
            : null,
          mintingDate: token.mintingDate ? parseInt(token.mintingDate) : null,
          selfProduced: selfProducedIds ? selfProducedIds.includes(token.id) : null,
          totalSupply: {
            id: token.totalSupply.id,
            value: token.totalSupply.value ? parseFloat(token.totalSupply.value) : null,
            valueExact: token.totalSupply.valueExact ? parseInt(token.totalSupply.valueExact) : null
          }
        }
      };
    }
    return tokensInfo;
  }
  return null;
}

export function getBasicTokensInfo(
  amounts: string[] | null,
  tokens: IBasicTokenFieldsOOT[] | null,
  selfProducedIds: string[] | null
): ITokensInfo | null {
  let tokensInfo: ITokensInfo | null = null;
  if (amounts && tokens) {
    tokensInfo = {};
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      tokensInfo[token.id] = {
        amount: parseInt(amounts[i]),
        token: getTokenFields(token, selfProducedIds)
      };
    }
    return tokensInfo;
  }
  return null;
}

function getTokenFields(token: IBasicTokenFieldsOOT, selfProducedIds: string[] | null): ITokenFields {
  return {
    id: token.id,
    contract: token.contract.id,
    tokenType: token.tokenType ? getTokenType(token.tokenType) : null,
    identifier: token.identifier,
    industrialUnitTokenInfo: null,
    mintingDate: token.mintingDate ? parseInt(token.mintingDate) : null,
    selfProduced: selfProducedIds ? selfProducedIds.includes(token.id) : null,
    totalSupply: {
      id: token.totalSupply.id,
      value: token.totalSupply.value ? parseFloat(token.totalSupply.value) : null,
      valueExact: token.totalSupply.valueExact ? parseInt(token.totalSupply.valueExact) : null
    }
  };
}

function parseEvent({ id, emitter, transaction }: IEventOOT): IEvent {
  return {
    id,
    emitter: emitter.id,
    transaction: parseTransaction(transaction)
  };
}

function parseTransaction({ id, blockNumber, timestamp }: ITransactionOOT): ITransaction {
  return { id, blockNumber: parseInt(blockNumber), timestamp: parseInt(timestamp) };
}

export function getCertificate(certificate: ICertificateOOT): ICertificate {
  return {
    id: certificate.id,
    contract: certificate.contract.id,
    certification: certificate.certification?.map((certification) => parseEvent(certification)) ?? null,
    creationDate: parseInt(certificate.creationDate),
    identifier: certificate.identifier,
    member: certificate.contract.owner?.asMemberContract
      ? getMember(certificate.contract.owner.asMemberContract)
      : null,
    tokenTypes: certificate.tokenTypes?.map((type) => getTokenType(type.tokenType)) ?? null,
    metadata: getMetadata(certificate),
    uri: certificate.uri
  };
}

export function getMetadata({
  bottleQuality,
  bottleMaterial,
  bottleSize,
  description,
  imageHeight,
  imagePath,
  imageWidth,
  oliveQuality,
  oliveOilAcidity,
  oliveOilAroma,
  oliveOilBitterness,
  oliveOilColour,
  oliveOilFruitness,
  oliveOilIntensity,
  oliveOilItching,
  oliveOrigin,
  title
}: ICertificateOOT | ITokenTypeOOT): IMetadata | null {
  if (
    bottleQuality ||
    bottleMaterial ||
    bottleSize ||
    description ||
    imageHeight ||
    imagePath ||
    imageWidth ||
    oliveQuality ||
    oliveOilAcidity ||
    oliveOilAroma ||
    oliveOilBitterness ||
    oliveOilColour ||
    oliveOilFruitness ||
    oliveOilIntensity ||
    oliveOilItching ||
    oliveOrigin ||
    title
  ) {
    return {
      bottle:
        bottleMaterial || bottleQuality || bottleSize
          ? {
              quality: bottleQuality,
              material: bottleMaterial,
              size: bottleSize ? parseInt(bottleSize) : null
            }
          : null,
      description: description,
      image:
        imageHeight || imagePath || imageWidth
          ? {
              path: imagePath,
              width: imageWidth ? parseInt(imageWidth) : null,
              height: imageHeight ? parseInt(imageHeight) : null
            }
          : null,
      olive:
        oliveQuality || oliveOrigin
          ? {
              quality: oliveQuality,
              origin: oliveOrigin
            }
          : null,
      oliveOil:
        oliveOilAcidity ||
        oliveOilAcidity ||
        oliveOilAroma ||
        oliveOilBitterness ||
        oliveOilColour ||
        oliveOilFruitness ||
        oliveOilIntensity ||
        oliveOilItching ||
        oliveOrigin
          ? {
              acidity: oliveOilAcidity ? parseFloat(oliveOilAcidity) : null,
              aroma: oliveOilAroma,
              bitterness: oliveOilBitterness,
              colour: oliveOilColour,
              fruitness: oliveOilFruitness,
              intensity: oliveOilIntensity,
              itching: oliveOilItching
            }
          : null,
      title: title
    };
  }
  return null;
}

export function getToken(token: ITokenOOT, balanceValue: string | null, selfProducedIds: string[] | null): IToken {
  const { ancestry } = token;
  let firstAncestry: IFirstAncestry[] | null = null;
  if (ancestry && ancestry.length > 0) {
    firstAncestry = [];
    for (let j = 0; j < ancestry.length; j++) {
      const secondAncestryOOT = ancestry[j].token.ancestry;
      let secondAncestry: ISecondAncestry[] | null = null;
      if (secondAncestryOOT && secondAncestryOOT.length > 0) {
        secondAncestry = [];
        for (let k = 0; k < secondAncestryOOT.length; k++) {
          const ancestorOOT: ITokenOOT = secondAncestryOOT[k].token;
          const tokenType = ancestorOOT.tokenType;
          const ancestor: ITokenFields = {
            id: ancestorOOT.id,
            contract: ancestorOOT.contract.id,
            tokenType: tokenType ? getTokenType(tokenType) : null,
            identifier: ancestorOOT.identifier,
            industrialUnitTokenInfo: ancestorOOT.industrialUnitTokenInfo
              ? getIndustrialUnitTokenInfo(ancestorOOT.industrialUnitTokenInfo, selfProducedIds)
              : null,
            mintingDate: ancestorOOT.mintingDate ? parseInt(ancestorOOT.mintingDate) : null,
            selfProduced: null,
            totalSupply: {
              id: ancestorOOT.totalSupply.id,
              value: ancestorOOT.totalSupply.value ? parseFloat(ancestorOOT.totalSupply.value) : null,
              valueExact: ancestorOOT.totalSupply.valueExact ? parseInt(ancestorOOT.totalSupply.valueExact) : null
            }
          };
          secondAncestry.push({ amount: secondAncestryOOT[k].amount, token: ancestor });
        }
      }
      const ancestorOOT: ITokenOOT = ancestry[j].token;
      const tokenType = ancestorOOT.tokenType;
      const ancestor: ITokenFirstAncestry = {
        id: ancestorOOT.id,
        ancestry: secondAncestry,
        contract: ancestorOOT.contract.id,
        tokenType: tokenType ? getTokenType(tokenType) : null,
        identifier: ancestorOOT.identifier,
        industrialUnitTokenInfo: ancestorOOT.industrialUnitTokenInfo
          ? getIndustrialUnitTokenInfo(ancestorOOT.industrialUnitTokenInfo, selfProducedIds)
          : null,
        mintingDate: ancestorOOT.mintingDate ? parseInt(ancestorOOT.mintingDate) : null,
        selfProduced: null,
        totalSupply: {
          id: ancestorOOT.totalSupply.id,
          value: ancestorOOT.totalSupply.value ? parseFloat(ancestorOOT.totalSupply.value) : null,
          valueExact: ancestorOOT.totalSupply.valueExact ? parseInt(ancestorOOT.totalSupply.valueExact) : null
        }
      };
      firstAncestry.push({ amount: ancestry[j].amount, token: ancestor });
    }
  }

  const escrowsOOT: IEscrowOOT[] | null = token.escrows ? token.escrows.map((escrow) => escrow.escrow) : null;
  let escrows: IEscrow[] | null = null;
  if (escrowsOOT) {
    escrows = [];
    for (let j = 0; j < escrowsOOT.length; j++) {
      const escrowOOT: IEscrowOOT = escrowsOOT[j];
      const escrow = getEscrow(escrowOOT, selfProducedIds);
      escrows.push(escrow);
    }
  }
  return {
    ancestry: firstAncestry,
    escrows,
    balance: balanceValue ? parseInt(balanceValue) : null,
    contract: token.contract.id,
    tokenType: token.tokenType ? getTokenType(token.tokenType) : null,
    id: token.id,
    identifier: token.identifier,
    industrialUnitTokenInfo: token.industrialUnitTokenInfo
      ? getIndustrialUnitTokenInfo(token.industrialUnitTokenInfo, selfProducedIds)
      : null,
    mintingDate: token.mintingDate ? parseInt(token.mintingDate) : null,
    selfProduced: selfProducedIds && selfProducedIds.includes(token.id),
    totalSupply: {
      id: token.totalSupply.id,
      value: token.totalSupply.value ? parseFloat(token.totalSupply.value) : null,
      valueExact: token.totalSupply.valueExact ? parseInt(token.totalSupply.valueExact) : null
    }
  };
}

function getIndustrialUnitTokenInfo(
  tokenInfo: IIndustrialUnitTokenInfoOOT,
  selfProducedIds: string[] | null
): IIndustrialUnitTokenInfo {
  return {
    id: tokenInfo.id,
    commercialUnits: getBasicTokensInfo(tokenInfo.amounts, tokenInfo.commercialUnits, selfProducedIds),
    industrialUnit: getTokenFields(tokenInfo.industrialUnit, selfProducedIds),
    member:
      tokenInfo.industrialUnit.contract.owner && tokenInfo.industrialUnit.contract.owner.asMemberContract
        ? getMember(tokenInfo.industrialUnit.contract.owner.asMemberContract)
        : null
  };
}

export function getEscrow(escrow: IEscrowOOT, selfProducedIds: string[] | null): IEscrow {
  return {
    id: escrow.id,
    buyer: escrow.buyer
      ? { member: escrow.buyer.asMemberContract ? getMember(escrow.buyer.asMemberContract) : null, id: escrow.buyer.id }
      : null,
    buyerWallet: escrow.buyerWallet,
    contract: escrow.contract.id,
    escrowBalance: {
      id: escrow.escrowBalance.id,
      escrowAccount: escrow.escrowBalance.escrowAccount ? escrow.escrowBalance.escrowAccount.id : null,
      tokensInfo: getBasicTokensInfo(
        escrow.escrowBalance.escrowAmounts,
        escrow.escrowBalance.escrowTokens,
        selfProducedIds
      )
    },
    etherBalance: {
      id: escrow.etherBalance.id,
      value: escrow.etherBalance.value ? parseFloat(escrow.etherBalance.value) : null,
      valueExact: escrow.etherBalance.valueExact ? parseInt(escrow.etherBalance.valueExact) : null
    },
    identifier: parseInt(escrow.identifier),
    price: escrow.price ? parseFloat(escrow.price) : null,
    seller: escrow.seller && escrow.seller.asMemberContract ? getMember(escrow.seller.asMemberContract) : null,
    sellerWallet: escrow.sellerWallet,
    state: escrow.state ? checkEscrowState(escrow.state) : null,
    tokenDeposits: escrow.tokenDeposits.map(({ transaction }) => ({ transaction: parseTransaction(transaction) }))
  };
}

function getMember(member: IMemberOOT): IMember {
  return {
    id: member.id,
    name: member.name,
    role: member.role ? checkRole(member.role) : null
  };
}

export function tokenTypeFilter(types: ITokenType[] | null, options: FilterOption[]): ITokenType[] | null {
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
  function typeMap({ member }: ITokenType) {
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

export function tokenFilter(tokens: IToken[] | null, options: FilterOption[]): IToken[] | null {
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
  function tokenMap({ industrialUnitTokenInfo, tokenType, selfProduced }: IToken) {
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
                ? industrialUnitTokenInfo?.member?.name ?? ''
                : option.key === 'type'
                ? tokenType?.identifier ?? ''
                : option.key === 'manufacturer'
                ? tokenType?.member?.name ?? ''
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

export function escrowFilter(escrows: IEscrow[] | null, options: FilterOption[]): IEscrow[] | null {
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
  function escrowMap({ buyer, seller, state }: IEscrow) {
    return options.map((option) => {
      return (
        Boolean(
          option.items &&
            (Array.isArray(option.items) ? option.items.length > 0 : true) &&
            (option.key === 'buyer' || option.key === 'seller' || option.key === 'state') &&
            booleanFilter(
              option.key === 'buyer'
                ? buyer?.member?.name ?? buyer?.id ?? ''
                : option.key === 'seller'
                ? seller?.name ?? ''
                : state ?? '',
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

export function tokenSearch(data: IToken[] | null, query: string | null): IToken[] | null {
  if (data) {
    if (query) {
      const query_ = query.toLowerCase();
      return data.filter(
        (token) => token.id.toLowerCase().indexOf(query_) > -1 || token.identifier.toLowerCase().indexOf(query_) > -1
      );
    }
    return data;
  }
  return null;
}

export function certificateSearch(data: ICertificate[] | null, query: string | null): ICertificate[] | null {
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

export function tokenTypeSearch(data: ITokenType[] | null, query: string | null): ITokenType[] | null {
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

export function escrowSearch(data: IEscrow[] | null, query: string | null): IEscrow[] | null {
  if (data) {
    if (query) {
      const query_ = query.toLowerCase();
      return data.filter(
        (escrow) =>
          escrow.id.toLowerCase().indexOf(query_) > -1 ||
          escrow.identifier.toString().toLowerCase().indexOf(query_) > -1
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
  data: IToken[] | string,
  key: 'selfProduced' | 'manufacturer' | 'packer' | 'type'
): IItem[] | null {
  const getKeySet = (
    data: IToken[] | string,
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

export function getItemsFromEscrows(data: IEscrow[] | string, key: keyof IEscrow): IItem[] | null {
  const getKeySet = (data: IEscrow[] | string, key: keyof IEscrow): string[] | null => {
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
          source.push(
            escrow.buyer ? (escrow.buyer.member ? escrow.buyer.member.name ?? escrow.buyer.id : escrow.buyer.id) : ''
          );
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

export function getItemsFromTypes(data: ITokenType[] | string, key: keyof ITokenType): IItem[] | null {
  const getKeySet = (data: ITokenType[] | string, key: keyof ITokenType): string[] | null => {
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
