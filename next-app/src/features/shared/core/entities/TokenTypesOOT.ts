import { IMemberOOT } from 'next-app/src/features/shared/utils/interfaces';
import { ICertificateOOT } from 'next-app/src/features/shared/core/entities/CertificatesOOT';
import { IEventOOT } from 'next-app/src/features/shared/core/entities/EventsOOT';
import { IMetadataOOT } from 'next-app/src/features/shared/core/entities/MetadataOOT';

export interface ITokenTypeInstructionOOT {
  id: string;
  instructedTokenAmount: string | null;
  instructedCertificate: {
    id: string;
    title: string | null;
    tokenTypes:
      | {
          tokenType: {
            id: string;
            title: string | null;
            contract: { owner: { asMemberContract: { role: string | null } | null } | null };
          };
        }[]
      | null;
  } | null;
  instructedTokenType: {
    id: string;
    title: string | null;
    contract: { owner: { asMemberContract: { role: string | null } | null } | null };
  } | null;
}

export interface ITokenTypeOOT extends IMetadataOOT {
  id: string;
  identifier: string;
  certificates?: { certificate: ICertificateOOT }[] | null;
  contract?: {
    id: string;
    owner: {
      asMemberContract: IMemberOOT | null;
    } | null;
  };
  creationDate: string;
  instructions?: ITokenTypeInstructionOOT[] | null;
  tokenTypeInstructionsSet?: IEventOOT | null;
  uri: string | null;
}
