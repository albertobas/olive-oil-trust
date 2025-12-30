import { useTokenTypeById } from '@features/explore/ui/hooks/useTokenTypeById';
import TokenTypeById from '@features/explore/ui/tokenTypes/TokenTypeById';

function TokenTypeByIdCSR({ id }: { id: string }): JSX.Element {
  const state = useTokenTypeById(id);

  return <TokenTypeById id={id} {...state} />;
}

export default TokenTypeByIdCSR;
