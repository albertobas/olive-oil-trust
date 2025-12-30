import { getCertificate } from '@features/shared/utils/helpers/certificate';
import { Certificate } from '@features/shared/core/entities/Certificates';
import { CertificateByIdQuery } from '.graphclient';

function certificateByIdAdapter(dataRaw: CertificateByIdQuery): Certificate | null {
  if (dataRaw.certificate) {
    return getCertificate(dataRaw.certificate);
  }
  return null;
}

export default certificateByIdAdapter;
