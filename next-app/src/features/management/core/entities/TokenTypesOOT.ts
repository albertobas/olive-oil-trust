import { ICertificateOOT } from 'next-app/src/features/shared/core/entities/CertificatesOOT';
import { ITokenTypeOOT } from 'next-app/src/features/shared/core/entities/TokenTypesOOT';

export interface IAllTokenTypesAndCertificatesOOT {
  tokenTypes: ITokenTypeOOT[];
  certificates: ICertificateOOT[];
}
