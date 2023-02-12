import { NextPage } from 'next';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import AllEscrows from 'next-app/src/features/explore/ui/escrows/AllEscrows';
import { useAllEscrows } from 'next-app/src/features/explore/ui/hooks/useAllEscrows';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import { brandName } from 'next-app/src/shared/utils/constants';

const EscrowsPage: NextPage = () => {
  const state = useAllEscrows(pollInterval);

  return (
    <>
      <Breadcrumbs />
      <Intro title="Escrows" description={`In this page you can explore all the escrows that exist in ${brandName}.`} />
      <AllEscrows {...state} />;
    </>
  );
};

export default EscrowsPage;
