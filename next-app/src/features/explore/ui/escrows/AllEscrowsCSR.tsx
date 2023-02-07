import { useAllEscrows } from 'next-app/src/features/explore/ui/hooks/useAllEscrows';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import AllEscrows from 'next-app/src/features/explore/ui/escrows/AllEscrows';

const AllEscrowsCSR = (): JSX.Element => {
  const state = useAllEscrows(pollInterval);

  return <AllEscrows {...state} />;
};

export default AllEscrowsCSR;
