import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import TokenTypeById from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeById';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

const DynamicTokenTypePage: NextPage = () => {
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
          <TokenTypeById id={id} />
        </>
      );
    }

    return <FallbackMessage message="Unable to retrieve the token type id" error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page" />;
};

export default DynamicTokenTypePage;
