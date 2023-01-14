import { getCertificate } from 'next-app/src/features/shared/utils/helpers';
import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { IAllCertificatesOOT } from 'next-app/src/features/explore/core/entities/CertificatesOOT';

function allCertificatesAdapter(dataRaw: IAllCertificatesOOT | undefined): ICertificates | null {
  if (dataRaw && dataRaw.certificates) {
    let certificates: ICertificates | null = null;
    if (dataRaw.certificates.length > 0) {
      certificates = {};
      for (let i = 0; i < dataRaw.certificates.length; i++) {
        const certificateOOT = dataRaw.certificates[i];
        certificates[certificateOOT.id] = getCertificate(certificateOOT);
      }
    }
    return certificates;
  }
  return null;
}

export default allCertificatesAdapter;
