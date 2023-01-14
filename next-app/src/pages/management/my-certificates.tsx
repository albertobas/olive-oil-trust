import { NextPage } from 'next';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { isCertifier } from 'next-app/src/shared/utils/constants';
import MyCertificatesByMember from 'next-app/src/features/management/ui/certificates/MyCertificatesByMember';

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
              <Intro title={'My Certificates'} description={'This is the description of my escrows'} />
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
