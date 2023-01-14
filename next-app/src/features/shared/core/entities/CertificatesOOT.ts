import { IEventOOT } from 'next-app/src/features/shared/core/entities/EventsOOT';
import { IMetadataOOT } from 'next-app/src/features/shared/core/entities/MetadataOOT';
import { ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';

export interface ICertificateOOT extends IMetadataOOT {
  id: string;
  identifier: string;
  certification: IEventOOT[] | null;
  contract: {
    id: string;
    owner: {
      asMemberContract: {
        id: string;
        name: string | null;
        role: string | null;
      } | null;
    } | null;
  };
  creationDate: string;
  tokenContract: {
    id: string;
  };
  tokenTypes?:
    | {
        tokenType: ITokenTypeOOT;
      }[]
    | null;
  uri: string;
}
