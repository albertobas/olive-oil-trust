import { NextPage } from 'next';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import AllTokens from 'next-app/src/features/explore/ui/tokens/AllTokens';

const TokensPage: NextPage = () => {
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    return (
      <>
        <Breadcrumbs />
        <Intro title={'Tokens'} description={'This is the description of my tokens'} />
        <AllTokens />
      </>
    );
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page" />;
};

export default TokensPage;
