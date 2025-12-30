import { Certificates } from '@features/shared/core/entities/Certificates';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';

export interface CertificatesByMemberAndAllTokenTypes {
  certificates: Certificates | null;
  tokenTypes: TokenTypes | null;
}
