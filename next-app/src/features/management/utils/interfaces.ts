import { Module } from '@shared/utils/interfaces';

export interface IAddTokenTypeState {
  id: string;
  instructedAddresses: string[];
  instructedIds: string[];
  instructedAmounts: number[];
  instructedTypeModules: Module[];
  instructedTitles: (string | null)[];
}

export interface IBaseTokenState {
  tokenTypeId: string;
  tokenId: string;
  tokenIdentifier: string;
  tokenAmount: number;
}

export interface IMintTokenState extends IBaseTokenState {
  inputAddresses?: string[][];
  inputAmounts?: number[][];
  inputTypeIds?: string[][];
  inputIds?: string[][];
}

export interface IBurnTokenState extends IBaseTokenState {
  tokenAddress: string;
}

export interface ICertifyTokenTypeState {
  certificateId: string;
  tokenAddresses: string[];
  tokenTypeIds: string[];
  tokenTypeTitles: string[];
}

export interface IPackTokenState {
  packId: string;
  tokenAddresses: string[] | null;
  tokenTypeIds: (string | null)[];
  tokenIds: string[];
  tokenAmounts: number[];
}

export interface IFormikTokenType {
  id: string;
  fieldArray: {
    id: string | null;
    amount: string;
  }[];
}

export interface IFormikMintToken {
  tokenId: string;
  tokenTypeId: string;
  tokenAmount: string;
  fields: FormikMintTokenFields;
}

export type FormikMintTokenFields = Record<
  string,
  {
    data: {
      id: string | null;
      amount: string;
    }[];
    shouldConvert: boolean;
  }
>;

export interface IFormikPackToken {
  packId: string;
  fieldArray: {
    id: string | null;
    amount: string;
  }[];
}

export interface IFormikUnpackToken {
  ids: string[] | null;
}

export interface IFormikBurnToken {
  fieldArray: {
    id: string | null;
    amount: string;
  }[];
}

export interface IFormikDepositToken {
  price: string;
  sellerWallet: string;
  ids: string[] | null;
  fieldArray: {
    id: string | null;
    amount: string;
  }[];
}

export interface IFormikCertificate {
  certificateId: string;
  ids: string[] | null;
}

export interface IFormikMakeOffer {
  buyerWallet: string;
  price: string;
}

export interface IFormikMakePayment {
  buyerWallet: string;
}
