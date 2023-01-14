import { IMember } from 'next-app/src/features/shared/utils/interfaces';
import { IEvent } from 'next-app/src/features/shared/core/entities/Events';
import { IMetadata } from 'next-app/src/features/shared/core/entities/Metadata';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface ICertificate {
  id: string;
  identifier: string;
  contract: string;
  certification: IEvent[] | null;
  creationDate: number;
  member: IMember | null;
  metadata: IMetadata | null;
  tokenTypes: ITokenType[] | null;
  uri: string;
}

export interface ICertificates {
  [certificateId: string]: ICertificate;
}
