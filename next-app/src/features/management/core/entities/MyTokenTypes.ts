import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface IAllTokenTypesAndCertificates {
  tokenTypes: ITokenTypes | null;
  certificates: ICertificates | null;
}
