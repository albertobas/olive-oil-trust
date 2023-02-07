import styles from 'next-app/src/features/shared/styles/modules/tokenTypes/TokenTypesCardList.module.css';
import React, { useEffect, useState } from 'react';
import { sortTokenTypeArray } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import TokenTypeCard from 'next-app/src/features/shared/ui/tokenTypes/TokenTypeCard';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';

type Props = {
  data: ITokenType[];
  reverse: boolean;
  sort: IItem | null;
};
function TokenTypesCardList({ data, reverse, sort }: Props): JSX.Element {
  const [stateData, setStateData] = useState<ITokenType[] | null>(
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
