import { getCertificate } from '@features/shared/utils/helpers/certificate';
import { getTokenType } from '@features/shared/utils/helpers/tokenType';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';
import { IAllTokenTypesAndCertificates } from '@features/management/core/entities/MyTokenTypes';
import { Certificates } from '@features/shared/core/entities/Certificates';
import { AllTokenTypesAndCertificatesQuery } from '.graphclient';

const allTokenTypesAndCertificatesAdapter = (
  dataRaw: AllTokenTypesAndCertificatesQuery
): IAllTokenTypesAndCertificates | null => {
  let tokenTypes: TokenTypes | null = null;
  let certificates: Certificates | null = null;
  if (dataRaw.tokenTypes.length > 0) {
    tokenTypes = {};
    for (let i = 0; i < dataRaw.tokenTypes.length; i++) {
      const tokenTypeRaw = dataRaw.tokenTypes[i];
      tokenTypes[tokenTypeRaw.id] = getTokenType(tokenTypeRaw);
    }
  }
  if (dataRaw.certificates.length > 0) {
    certificates = {};
    for (let i = 0; i < dataRaw.certificates.length; i++) {
      const certificateRaw = dataRaw.certificates[i];
      certificates[certificateRaw.id] = getCertificate(certificateRaw);
    }
  }
  return { tokenTypes, certificates };
};

export default allTokenTypesAndCertificatesAdapter;
