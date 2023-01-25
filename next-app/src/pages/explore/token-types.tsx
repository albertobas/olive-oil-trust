import { NextPage } from 'next';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import AllTokenTypes from 'next-app/src/features/explore/ui/tokenTypes/AllTokenTypes';
import { brandName } from 'next-app/src/shared/utils/constants';

const TokenTypesPage: NextPage = () => {
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    return (
      <>
        <Breadcrumbs />
        <Intro
          title={'Token Types'}
          description={`In this page you can explore all the types of tokens that exist in ${brandName}.`}
        />
        <AllTokenTypes />
      </>
    );
  }

  return <FallbackMessage message={`You need to connect to ${brandName} to see this page`} />;
};

export default TokenTypesPage;
