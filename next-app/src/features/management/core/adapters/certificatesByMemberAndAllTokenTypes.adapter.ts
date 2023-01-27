import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { getCertificate, getTokenType } from 'next-app/src/features/shared/utils/helpers';
import { ICertificatesByMemberAndAllTokenTypes } from 'next-app/src/features/management/core/entities/MyCertificates';
import { ICertificatesAndTokenTypesByMemberOOT } from 'next-app/src/features/management/core/entities/MyCertificatesOOT';

const certificatesByMemberAndAllTokenTypesAdapter = (
  dataRaw: ICertificatesAndTokenTypesByMemberOOT | undefined
): ICertificatesByMemberAndAllTokenTypes | null => {
  if (dataRaw) {
    const { memberContract, tokenTypes } = dataRaw;
    const certificates_: ICertificates = {};
    const tokenTypes_: ITokenTypes = {};
    if (memberContract) {
      for (let i = 0; i < memberContract.asAccount.ownerOfCertificateContract.length; i++) {
        const { certificates } = memberContract.asAccount.ownerOfCertificateContract[i];
        if (certificates && certificates.length > 0) {
          for (let j = 0; j < certificates.length; j++) {
            const certificateOOT = certificates[j];
            certificates_[certificateOOT.id] = getCertificate(certificateOOT);
          }
        }
      }
    }
    if (tokenTypes.length > 0) {
      for (let i = 0; i < tokenTypes.length; i++) {
        const tokenTypeOOT = tokenTypes[i];
        tokenTypes_[tokenTypeOOT.id] = getTokenType(tokenTypeOOT);
      }
    }

    return {
      certificates: Object.keys(certificates_).length > 0 ? certificates_ : null,
      tokenTypes: Object.keys(tokenTypes_).length > 0 ? tokenTypes_ : null
    };
  }
  return null;
};

export default certificatesByMemberAndAllTokenTypesAdapter;
