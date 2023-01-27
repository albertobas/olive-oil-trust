import { getCertificate, getTokenType } from 'next-app/src/features/shared/utils/helpers';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { IAllTokenTypesAndCertificatesOOT } from 'next-app/src/features/management/core/entities/MyTokenTypesOOT';
import { IAllTokenTypesAndCertificates } from 'next-app/src/features/management/core/entities/MyTokenTypes';
import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';

const allTokenTypesAndCertificatesAdapter = (
  dataRaw: IAllTokenTypesAndCertificatesOOT | undefined
): IAllTokenTypesAndCertificates | null => {
  if (dataRaw) {
    let tokenTypes: ITokenTypes | null = null;
    let certificates: ICertificates | null = null;
    if (dataRaw.tokenTypes.length > 0) {
      tokenTypes = {};
      for (let i = 0; i < dataRaw.tokenTypes.length; i++) {
        const tokenTypeOOT = dataRaw.tokenTypes[i];
        tokenTypes[tokenTypeOOT.id] = getTokenType(tokenTypeOOT);
      }
    }
    if (dataRaw.certificates.length > 0) {
      certificates = {};
      for (let i = 0; i < dataRaw.certificates.length; i++) {
        const certificateOOT = dataRaw.certificates[i];
        certificates[certificateOOT.id] = getCertificate(certificateOOT);
      }
    }
    return { tokenTypes, certificates };
  }
  return null;
};

export default allTokenTypesAndCertificatesAdapter;
