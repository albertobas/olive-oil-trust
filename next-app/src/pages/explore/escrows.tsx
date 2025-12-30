import { NextPage } from 'next';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from '@features/shared/ui/intro/Intro';
import AllEscrows from '@features/explore/ui/escrows/AllEscrows';
import { useAllEscrows } from '@features/explore/ui/hooks/useAllEscrows';
import { pollInterval } from '@features/shared/utils/constants';
import { brandName } from '@shared/utils/constants';

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
