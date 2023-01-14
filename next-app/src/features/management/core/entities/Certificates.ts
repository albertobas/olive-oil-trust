import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';

export interface ICertificatesByMemberAndAllTokenTypes {
  certificates: ICertificates | null;
  tokenTypes: ITokenTypes | null;
}
