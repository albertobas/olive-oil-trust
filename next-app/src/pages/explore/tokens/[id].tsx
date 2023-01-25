import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import TokenById from 'next-app/src/features/explore/ui/tokens/TokenById';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { brandName } from 'next-app/src/shared/utils/constants';

const DynamicTokenPage: NextPage = () => {
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
          <TokenById id={id} />
        </>
      );
    }

    return <FallbackMessage message="Unable to retrieve the token id" error />;
  }

  return <FallbackMessage message={`You need to connect to ${brandName} to see this page`} />;
};

export default DynamicTokenPage;
