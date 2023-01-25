import { Fragment } from 'react';
import { NextPage } from 'next';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { isCertifier, isSeller } from 'next-app/src/shared/utils/constants';
import MyTokensByAccount from 'next-app/src/features/management/ui/tokens/MyTokensByAccount';
import MyTokensByMember from 'next-app/src/features/management/ui/tokens/MyTokensByMember';

function MyTokensLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <Intro title={'My Tokens'} description={`In this page you can manage your tokens.`} />
      <Fragment>{children}</Fragment>
    </>
  );
}

const MyTokensPage: NextPage = () => {
  const { data } = useAppSelector((state) => state.account);
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    if (data) {
      const { account, contract } = data;

      if (contract && contract.moduleId) {
        const { address, moduleId } = contract;

        if (isCertifier(moduleId)) {
          return <FallbackMessage message="Not authorized." error />;
        }

        return (
          <MyTokensLayout>
            {isSeller(moduleId) ? (
              <MyTokensByMember address={address} moduleId={moduleId} />
            ) : (
              <MyTokensByAccount address={account} />
            )}
          </MyTokensLayout>
        );
      }

      return (
        <MyTokensLayout>
          <MyTokensByAccount address={account} />
        </MyTokensLayout>
      );
    }

    return <FallbackMessage message="Unable to retrieve account details." error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page." />;
};

export default MyTokensPage;
