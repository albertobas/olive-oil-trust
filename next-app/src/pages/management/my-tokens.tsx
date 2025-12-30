import { Fragment } from 'react';
import { NextPage } from 'next';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from '@features/shared/ui/intro/Intro';
import useAppSelector from '@shared/ui/hooks/useAppSelector';
import { isCertifier } from '@shared/utils/constants';
import MyTokensByAccount from '@features/management/ui/tokens/MyTokensByAccount';
import MyTokensByMember from '@features/management/ui/tokens/MyTokensByMember';

function MyTokensLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <Intro title="My Tokens" description="In this page you can manage your tokens." />
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
            <MyTokensByMember address={address} moduleId={moduleId} />
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
