import { IMember } from '@features/shared/utils/interfaces';
import { Event } from '@features/shared/core/entities/Events';
import { Metadata } from '@features/shared/core/entities/Metadata';
import { TokenType } from '@features/shared/core/entities/TokenTypes';

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
