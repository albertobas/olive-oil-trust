import { useAllTokenTypes } from 'next-app/src/features/explore/ui/hooks/useAllTokenTypes';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import AllTokenTypes from 'next-app/src/features/explore/ui/tokenTypes/AllTokenTypes';

const AllTokenTypesCSR = (): JSX.Element => {
  const state = useAllTokenTypes(pollInterval);

  return <AllTokenTypes {...state} />;
};

export default AllTokenTypesCSR;
