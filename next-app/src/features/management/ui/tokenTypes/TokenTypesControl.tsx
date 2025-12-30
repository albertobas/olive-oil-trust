import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Certificate } from '@features/shared/core/entities/Certificates';
import { TokenType } from '@features/shared/core/entities/TokenTypes';
import { IItem } from '@features/shared/utils/interfaces';
import AddTokenTypes from '@features/management/ui/tokenTypes/AddTokenTypes';
import styles from '@features/management/styles/modules/tokenTypes/TokenTypesControl.module.css';
import SearchSortBar from '@features/shared/ui/search/SearchSortBar';
import { sortTokenTypeCardsRecords } from '@features/shared/utils/constants';
import ReactModal from 'react-modal';

type Props = {
  previousTokenTypes: TokenType[] | null;
  certificates: Certificate[] | null;
  reverse: boolean;
  sort: IItem | null;
  query: string | null;
  setQuery: Dispatch<SetStateAction<string | null>>;
  setReverse: Dispatch<SetStateAction<boolean>>;
  setSort: Dispatch<SetStateAction<IItem | null>>;
  setFilters?: Dispatch<SetStateAction<boolean>>;
};

const TokenTypesControl = ({
  previousTokenTypes,
  certificates,
  reverse,
  sort,
  query,
  setQuery,
  setReverse,
  setSort,
  setFilters
}: Props): JSX.Element => {
  const [isAddingTokenTypes, setIsAddingTokenTypes] = useState<boolean>(false);
  const sortOptions = useMemo(() => {
    return Object.keys(sortTokenTypeCardsRecords).map((key) => {
      return { label: sortTokenTypeCardsRecords[key as keyof typeof sortTokenTypeCardsRecords], value: key } as IItem;
    });
  }, []);

  function handleClick() {
    setIsAddingTokenTypes((b) => !b);
  }

  const actionBtn = previousTokenTypes && {
    onClick: handleClick,
    children: 'Add Token Types',
    disabled: isAddingTokenTypes
  };

  return (
    <>
      <SearchSortBar
        query={query}
        reverse={reverse}
        sort={sort}
        options={sortOptions}
        actionBtn={actionBtn}
        searchKey="token types"
        setReverse={setReverse}
        setQuery={setQuery}
        setSort={setSort}
        setFilters={setFilters}
      />
      <ReactModal isOpen={isAddingTokenTypes} className={styles.modal} overlayClassName="overlay">
        <AddTokenTypes
          previousTokenTypes={previousTokenTypes}
          certificates={certificates}
          setIsAddingTokenTypes={setIsAddingTokenTypes}
        />
      </ReactModal>
    </>
  );
};

export default TokenTypesControl;
