import { useTokenTypeById } from 'next-app/src/features/explore/ui/hooks/useTokenTypeById';
import TokenTypeById from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeById';

function TokenTypeByIdCSR({ id }: { id: string }): JSX.Element {
  const state = useTokenTypeById(id);

  return <TokenTypeById id={id} {...state} />;
}

export default TokenTypeByIdCSR;
