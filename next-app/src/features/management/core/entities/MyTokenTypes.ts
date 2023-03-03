import { Certificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { TokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface IAllTokenTypesAndCertificates {
  tokenTypes: TokenTypes | null;
  certificates: Certificates | null;
}
