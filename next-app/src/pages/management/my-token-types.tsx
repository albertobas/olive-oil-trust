import { NextPage } from 'next';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { isBottlingPlant, isCreator, isOliveOilMill } from 'next-app/src/shared/utils/constants';
import MyTokenTypes from 'next-app/src/features/management/ui/tokenTypes/MyTokenTypes';

const MyTokenTypesPage: NextPage = () => {
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

        const previousRoles = isOliveOilMill(moduleId)
          ? ['OliveGrower']
          : isBottlingPlant(moduleId)
          ? ['OliveOilMill', 'BottleManufacturer']
          : undefined;

        if (isCreator(moduleId)) {
          return (
            <>
              <Breadcrumbs />
              <Intro title={'My Token Types'} description={`In this page you can manage your token types.`} />
              <MyTokenTypes memberAddress={address} moduleId={moduleId} previousRoles={previousRoles} />
            </>
          );
        }

        return <FallbackMessage message="Not authorized. Only Creator members can manage token types." error />;
      }

      return <FallbackMessage message="Not authorized." error />;
    }

    return <FallbackMessage message="Unable to retrieve account details." error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page." />;
};

export default MyTokenTypesPage;
