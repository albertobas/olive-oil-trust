import { Escrow } from 'next-app/src/features/shared/core/entities/Escrows';
import {
  FirstAncestry,
  IndustrialUnitTokenInfo,
  SecondAncestry,
  Token,
  TokenFields,
  TokenFirstAncestry,
  TokensInfo
} from 'next-app/src/features/shared/core/entities/Tokens';
import { getEscrow } from 'next-app/src/features/shared/utils/helpers/escrow';
import { getTokenType } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { getMember } from 'next-app/src/features/shared/utils/helpers/member';
import { EscrowRawType, TokenInfoRawType, TokenRawType } from 'next-app/src/features/shared/utils/interfaces';

export function getToken(token: TokenRawType, balanceValue: string | null, selfProducedIds: string[] | null): Token {
  const { ancestry } = token;
  let firstAncestry: FirstAncestry[] | null = null;
  if (ancestry && ancestry.length > 0) {
    firstAncestry = [];
    for (let j = 0; j < ancestry.length; j++) {
      const secondAncestryRaw = ancestry[j].token.ancestry;
      let secondAncestry: SecondAncestry[] | null = null;
      if (secondAncestryRaw && secondAncestryRaw.length > 0) {
        secondAncestry = [];
        for (let k = 0; k < secondAncestryRaw.length; k++) {
          const secondAncestorRaw = secondAncestryRaw[k].token;
          const tokenType = secondAncestorRaw.tokenType;
          const ancestor: TokenFields = {
            id: secondAncestorRaw.id,
            contract: secondAncestorRaw.contract.id,
            tokenType: tokenType ? getTokenType(tokenType) : null,
            identifier: secondAncestorRaw.identifier,
            industrialUnitTokenInfo: null,
            mintingDate: secondAncestorRaw.mintingDate ? parseInt(secondAncestorRaw.mintingDate) : null,
            selfProduced: null,
            title: `${secondAncestorRaw.industrialUnitTokenInfo ? 'Pallet' : 'Batch'} ${token.identifier}`,
            totalSupply: {
              id: secondAncestorRaw.totalSupply.id,
              value: secondAncestorRaw.totalSupply.value ? parseFloat(secondAncestorRaw.totalSupply.value) : null,
              valueExact: secondAncestorRaw.totalSupply.valueExact
                ? parseInt(secondAncestorRaw.totalSupply.valueExact)
                : null
            }
          };
          secondAncestry.push({ amount: secondAncestryRaw[k].amount, token: ancestor });
        }
      }
      const ancestorRaw = ancestry[j].token;
      const tokenType = ancestorRaw.tokenType;
      const ancestor: TokenFirstAncestry = {
        id: ancestorRaw.id,
        ancestry: secondAncestry,
        contract: ancestorRaw.contract.id,
        tokenType: tokenType ? getTokenType(tokenType) : null,
        identifier: ancestorRaw.identifier,
        industrialUnitTokenInfo: null,
        mintingDate: ancestorRaw.mintingDate ? parseInt(ancestorRaw.mintingDate) : null,
        selfProduced: null,
        title: `${ancestorRaw.industrialUnitTokenInfo ? 'Pallet' : 'Batch'} ${token.identifier}`,
        totalSupply: {
          id: ancestorRaw.totalSupply.id,
          value: ancestorRaw.totalSupply.value ? parseFloat(ancestorRaw.totalSupply.value) : null,
          valueExact: ancestorRaw.totalSupply.valueExact ? parseInt(ancestorRaw.totalSupply.valueExact) : null
        }
      };
      firstAncestry.push({ amount: ancestry[j].amount, token: ancestor });
    }
  }
  const escrowsRaw = token.escrows ? token.escrows.map((escrow) => escrow.escrow) : null;
  let escrows: Escrow[] | null = null;
  if (escrowsRaw) {
    escrows = [];
    for (let j = 0; j < escrowsRaw.length; j++) {
      const escrowRaw = escrowsRaw[j];
      const escrow = getEscrow(escrowRaw, selfProducedIds);
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
    title: `${token.industrialUnitTokenInfo ? 'Pallet' : 'Batch'} ${token.identifier}`,
    totalSupply: {
      id: token.totalSupply.id,
      value: token.totalSupply.value ? parseFloat(token.totalSupply.value) : null,
      valueExact: token.totalSupply.valueExact ? parseInt(token.totalSupply.valueExact) : null
    }
  };
}

function getTokenFields(
  token: NonNullable<EscrowRawType['escrowBalance']['escrowTokens']>[0],
  selfProducedIds: string[] | null
): TokenFields {
  return {
    id: token.id,
    contract: token.contract.id,
    tokenType: token.tokenType ? getTokenType(token.tokenType) : null,
    identifier: token.identifier,
    industrialUnitTokenInfo: null,
    mintingDate: token.mintingDate ? parseInt(token.mintingDate) : null,
    selfProduced: selfProducedIds ? selfProducedIds.includes(token.id) : null,
    title: `Batch ${token.identifier}`,
    totalSupply: {
      id: token.totalSupply.id,
      value: token.totalSupply.value ? parseFloat(token.totalSupply.value) : null,
      valueExact: token.totalSupply.valueExact ? parseInt(token.totalSupply.valueExact) : null
    }
  };
}

function getIndustrialUnitTokenInfo(
  tokenInfo: TokenInfoRawType,
  selfProducedIds: string[] | null
): IndustrialUnitTokenInfo {
  const { amounts, commercialUnits } = tokenInfo;
  return {
    id: tokenInfo.id,
    commercialUnits: amounts ? getTokensInfo(amounts, commercialUnits, selfProducedIds) : null,
    industrialUnit: getTokenFields(tokenInfo.industrialUnit, selfProducedIds),
    member:
      tokenInfo.industrialUnit.contract.owner && tokenInfo.industrialUnit.contract.owner.asMemberContract
        ? getMember(tokenInfo.industrialUnit.contract.owner.asMemberContract)
        : null
  };
}

export function getTokensInfo(
  amounts: string[],
  tokens: NonNullable<EscrowRawType['escrowBalance']['escrowTokens']>,
  selfProducedIds: string[] | null
): TokensInfo | null {
  let tokensInfo: TokensInfo | null = null;
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

export const sortTokenArray = (data: Token[], sortValue: string | undefined, reverse: boolean): Token[] => {
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
    } else if (sortValue === 'title') {
      return data.sort((a, b) => (a.title > b.title ? -1 : a.title < b.title ? 1 : 0));
    } else if (sortValue === 'type') {
      return data.sort((a, b) =>
        a.tokenType?.metadata?.title && b.tokenType?.metadata?.title
          ? a.tokenType?.metadata?.title > b.tokenType.metadata?.title
            ? -1
            : a.tokenType?.metadata?.title < b.tokenType?.metadata?.title
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'typeId') {
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
    } else if (sortValue === 'title') {
      return data.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
    } else if (sortValue === 'type') {
      return data.sort((a, b) =>
        a.tokenType?.metadata?.title && b.tokenType?.metadata?.title
          ? a.tokenType?.metadata?.title < b.tokenType.metadata?.title
            ? -1
            : a.tokenType?.metadata?.title > b.tokenType?.metadata?.title
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'typeId') {
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
