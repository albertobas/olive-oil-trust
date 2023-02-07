import { useAllTokens } from 'next-app/src/features/explore/ui/hooks/useAllTokens';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import AllTokens from 'next-app/src/features/explore/ui/tokens/AllTokens';

const AllTokensCSR = (): JSX.Element => {
  const state = useAllTokens(pollInterval);

  return <AllTokens {...state} />;
};

export default AllTokensCSR;
