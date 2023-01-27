import { ICertificateOOT } from 'next-app/src/features/shared/core/entities/CertificatesOOT';
import { ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';

export interface ICertificatesAndTokenTypesByMemberOOT {
  memberContract: {
    id: string;
    name: string | null;
    role: string | null;
    asAccount: {
      ownerOfCertificateContract: {
        id: string;
        certificates: ICertificateOOT[] | null;
      }[];
    };
  } | null;
  tokenTypes: ITokenTypeOOT[];
}
