import styles from 'next-app/src/features/shared/styles/modules/tokens/TokensCardList.module.css';
import React, { useEffect, useState } from 'react';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import TokenCard from 'next-app/src/features/shared/ui/tokens/TokenCard';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import { sortTokenArray } from 'next-app/src/features/shared/utils/helpers/token';

type Props = {
  data: IToken[];
  reverse: boolean;
  sort: IItem | null;
};

function TokensCardList({ data, reverse, sort }: Props): JSX.Element {
  const [stateData, setStateData] = useState<IToken[] | null>(
    data ? (sort ? sortTokenArray(data.slice(), sort?.value, reverse) : data) : null
  );
  useEffect(() => {
    setStateData(
      sort ? sortTokenArray(data.slice(), sort?.value, reverse) : sortTokenArray(data.slice(), 'date', false)
    );
  }, [data, reverse, sort]);

  return (
    <div className={styles.layout}>
      {stateData && stateData.map((token) => <TokenCard key={token.id} {...token} />)}
    </div>
  );
}

export default TokensCardList;
