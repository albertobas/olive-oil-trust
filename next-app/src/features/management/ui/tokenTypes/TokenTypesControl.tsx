import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import AddTokenTypes from 'next-app/src/features/management/ui/tokenTypes/AddTokenTypes';
import styles from 'next-app/src/features/management/styles/modules/tokenTypes/TokenTypesControl.module.css';
import SearchSortBar from 'next-app/src/features/shared/ui/search/SearchSortBar';
import { sortTokenTypeCardsRecords } from 'next-app/src/features/shared/utils/constants';
import ReactModal from 'react-modal';

type Props = {
  previousTokenTypes: ITokenType[] | null;
  certificates: ICertificate[] | null;
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
