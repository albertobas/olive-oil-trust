import { useTokenById } from 'next-app/src/features/explore/ui/hooks/useTokenById';
import TokenById from 'next-app/src/features/explore/ui/tokens/TokenById';

function TokenByIdCSR({ id }: { id: string }): JSX.Element {
  const state = useTokenById(id);

  return <TokenById id={id} {...state} />;
}

export default TokenByIdCSR;
