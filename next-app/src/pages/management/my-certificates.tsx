import { NextPage } from 'next';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from '@features/shared/ui/intro/Intro';
import useAppSelector from '@shared/ui/hooks/useAppSelector';
import { isCertifier } from '@shared/utils/constants';
import MyCertificatesByMember from '@features/management/ui/certificates/MyCertificatesByMember';

const MyCertificatesPage: NextPage = () => {
  const { data } = useAppSelector((state) => state.account);
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    if (data) {
      const { contract } = data;

      if (contract && contract.moduleId) {
        const { address, moduleId } = contract;

        if (isCertifier(moduleId)) {
          return (
            <>
              <Breadcrumbs />
              <Intro title="My Certificates" description="In this page you can manage your certificates." />
              <MyCertificatesByMember address={address} />
            </>
          );
        }

        return <FallbackMessage message="Not authorized. Only Certifier members can manage certificates." error />;
      }

      return <FallbackMessage message="Not authorized." error />;
    }

    return <FallbackMessage message="Unable to retrieve account details." error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page." />;
};

export default MyCertificatesPage;
