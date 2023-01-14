import { getCertificate } from 'next-app/src/features/shared/utils/helpers';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { ICertificateByIdOOT } from 'next-app/src/features/explore/core/entities/CertificatesOOT';

function certificateByIdAdapter(dataRaw: ICertificateByIdOOT | undefined): ICertificate | null {
  if (dataRaw && dataRaw.certificate) {
    return getCertificate(dataRaw.certificate);
  }
  return null;
}

export default certificateByIdAdapter;
