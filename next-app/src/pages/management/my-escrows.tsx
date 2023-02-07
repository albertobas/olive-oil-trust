import { NextPage } from 'next';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { isSeller } from 'next-app/src/shared/utils/constants';
import MyEscrowsByMember from 'next-app/src/features/management/ui/escrows/MyEscrowsByMember';

const MyEscrowsPage: NextPage = () => {
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

        if (isSeller(moduleId)) {
          return (
            <>
              <Breadcrumbs />
              <Intro title="My Escrows" description="In this page you can manage your escrows." />
              <MyEscrowsByMember address={address} />
            </>
          );
        }

        return <FallbackMessage message="Not authorized. Only Seller members can manage escrows." error />;
      }

      return <FallbackMessage message="Not authorized." error />;
    }

    return <FallbackMessage message="Unable to retrieve account details." error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page." />;
};

export default MyEscrowsPage;
