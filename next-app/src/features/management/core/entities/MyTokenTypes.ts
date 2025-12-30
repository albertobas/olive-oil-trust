import { Certificates } from '@features/shared/core/entities/Certificates';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';

export interface IAllTokenTypesAndCertificates {
  tokenTypes: TokenTypes | null;
  certificates: Certificates | null;
}
