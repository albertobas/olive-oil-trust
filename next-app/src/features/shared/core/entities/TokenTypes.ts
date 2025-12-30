import { Module } from '@shared/utils/interfaces';
import { IMember } from '@features/shared/utils/interfaces';
import { Certificate } from '@features/shared/core/entities/Certificates';
import { Event } from '@features/shared/core/entities/Events';
import { Metadata } from '@features/shared/core/entities/Metadata';

export interface TokenTypeInstruction {
  id: string;
  amount: number | null;
  certifiedTokenTypes: { id: string; title: string | null }[] | null;
  isCertificate: boolean;
  title: string | null;
  instructorModuleId: Module | null;
}

export interface TokenType {
  id: string;
  certificates: Certificate[] | null;
  contract: string | null;
  creationDate: number;
  identifier: string;
  instructions: TokenTypeInstruction[] | null;
  instructionsSetEvent: Event | null;
  member: IMember | null;
  metadata: Metadata | null;
  uri: string | null;
}

export interface TokenTypes {
  [tokenTypeId: string]: TokenType;
}
