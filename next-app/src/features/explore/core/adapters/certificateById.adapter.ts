import { getCertificate } from 'next-app/src/features/shared/utils/helpers/certificate';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { CertificateByIdQuery } from 'next-app/.graphclient';

function certificateByIdAdapter(dataRaw: CertificateByIdQuery): ICertificate | null {
  if (dataRaw.certificate) {
    return getCertificate(dataRaw.certificate);
  }
  return null;
}

export default certificateByIdAdapter;
