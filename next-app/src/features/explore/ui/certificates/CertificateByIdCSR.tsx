import { useCertificateById } from 'next-app/src/features/explore/ui/hooks/useCertificateById';
import CertificateById from 'next-app/src/features/explore/ui/certificates/CertificateById';

function CertificateByIdCSR({ id }: { id: string }): JSX.Element {
  const state = useCertificateById(id);

  return <CertificateById id={id} {...state} />;
}

export default CertificateByIdCSR;
