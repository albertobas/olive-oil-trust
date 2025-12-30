import styles from '@features/shared/styles/modules/tokenTypes/TokenTypesCardList.module.css';
import React, { useEffect, useState } from 'react';
import { sortTokenTypeArray } from '@features/shared/utils/helpers/tokenType';
import { IItem } from '@features/shared/utils/interfaces';
import TokenTypeCard from '@features/shared/ui/tokenTypes/TokenTypeCard';
import { TokenType } from '@features/shared/core/entities/TokenTypes';

type Props = {
  data: TokenType[];
  reverse: boolean;
  sort: IItem | null;
};
function TokenTypesCardList({ data, reverse, sort }: Props): JSX.Element {
  const [stateData, setStateData] = useState<TokenType[] | null>(
    sort ? sortTokenTypeArray(data.slice(), sort?.value, reverse) : data
  );
  useEffect(() => {
    setStateData(sort ? sortTokenTypeArray(data.slice(), sort?.value, reverse) : data);
  }, [data, reverse, sort]);

  return (
    <div className={styles.layout}>
      {stateData && stateData.map((type) => <TokenTypeCard key={type.id} {...type} />)}
    </div>
  );
}

export default TokenTypesCardList;
