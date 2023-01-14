import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { endpoints } from 'next-app/src/features/shared/ui/utils/constants';

const useEndpoint = (): { error: boolean | null; data: string | null } => {
  // get account and chain
  const { data } = useAppSelector((state) => state.account);

  // return endpoint
  if (data) {
    if (data.chainId === '1337') {
      return { error: false, data: endpoints.LOCALHOST };
    } else {
      return { error: false, data: null };
    }
  } else {
    return { error: true, data: null };
  }
};

export default useEndpoint;
