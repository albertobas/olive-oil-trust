import { Module } from 'next-app/src/shared/utils/interfaces';
import { IMember } from 'next-app/src/features/shared/utils/interfaces';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { IEvent } from 'next-app/src/features/shared/core/entities/Events';
import { IMetadata } from 'next-app/src/features/shared/core/entities/Metadata';

export interface ITokenTypeInstruction {
  id: string;
  amount: number | null;
  certifiedTokenTypes: { id: string; title: string | null }[] | null;
  isCertificate: boolean;
  title: string | null;
  instructorModuleId: Module | null;
}

export interface ITokenType {
  id: string;
  certificates: ICertificate[] | null;
  contract: string | null;
  creationDate: number;
  identifier: string;
  instructions: ITokenTypeInstruction[] | null;
  instructionsSetEvent: IEvent | null;
  member: IMember | null;
  metadata: IMetadata | null;
  uri: string | null;
}

export interface ITokenTypes {
  [tokenTypeId: string]: ITokenType;
}
