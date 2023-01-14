import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import CertificateById from 'next-app/src/features/explore/ui/certificates/CertificateById';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

const DynamicCertificatePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    if (typeof id === 'string') {
      return (
        <>
          <Breadcrumbs />
          <CertificateById id={id} />
        </>
      );
    }

    return <FallbackMessage message="Unable to retrieve the certificate id" error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page" />;
};

export default DynamicCertificatePage;
