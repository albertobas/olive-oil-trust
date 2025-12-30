import { NextPage } from 'next';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from '@features/shared/ui/intro/Intro';
import useAppSelector from '@shared/ui/hooks/useAppSelector';
import MyParticipations from '@features/management/ui/participations/MyParticipations';

const MyParticipationsPage: NextPage = () => {
  const { data } = useAppSelector((state) => state.account);
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    if (data) {
      const { account, contract } = data;

      return (
        <>
          <Breadcrumbs />
          <Intro title="My Participations" description="In this page you can manage your participations." />
          <MyParticipations address={contract ? contract.address : account} />
        </>
      );
    }

    return <FallbackMessage message="Unable to retrieve account details." error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page." />;
};

export default MyParticipationsPage;
