import { getCertificate } from 'next-app/src/features/shared/utils/helpers/certificate';
import { Certificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { AllCertificatesQuery } from 'next-app/.graphclient';

function allCertificatesAdapter(dataRaw: AllCertificatesQuery): Certificates | null {
  if (dataRaw.certificates.length > 0) {
    const certificates: Certificates = {};
    for (let i = 0; i < dataRaw.certificates.length; i++) {
      const certificateRaw = dataRaw.certificates[i];
      certificates[certificateRaw.id] = getCertificate(certificateRaw);
    }
    return certificates;
  }
  return null;
}

export default allCertificatesAdapter;
