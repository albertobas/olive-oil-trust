import { IMember } from 'next-app/src/features/shared/utils/interfaces';
import { Event } from 'next-app/src/features/shared/core/entities/Events';
import { Metadata } from 'next-app/src/features/shared/core/entities/Metadata';
import { TokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface Certificate {
  id: string;
  identifier: string;
  contract: string;
  certification: Event[] | null;
  creationDate: number;
  member: IMember | null;
  metadata: Metadata | null;
  tokenTypes: TokenType[] | null;
  uri: string;
}

export interface Certificates {
  [certificateId: string]: Certificate;
}
