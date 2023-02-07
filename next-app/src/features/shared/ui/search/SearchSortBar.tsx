import styles from 'next-app/src/features/shared/styles/modules/searchSortBar/SearchSortBar.module.css';
import { GoSearch } from 'react-icons/go';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import {
  BsSortAlphaDown,
  BsSortAlphaUp,
  BsSortNumericDown,
  BsSortNumericUp,
  BsSortDown,
  BsSortUp
} from 'react-icons/bs';
import { FiSliders } from 'react-icons/fi';
import { Button } from 'next-app/src/features/shared/ui/buttons/Button';
import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, SetStateAction, useCallback } from 'react';

type Props = {
  query: string | null;
  reverse: boolean;
  sort: IItem | null;
  options: IItem[];
  searchKey: string;
  setQuery: Dispatch<SetStateAction<string | null>>;
  setReverse: Dispatch<SetStateAction<boolean>>;
  setSort: Dispatch<SetStateAction<IItem | null>>;
  setFilters?: Dispatch<SetStateAction<boolean>>;
  actionBtn?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> | null;
};

function SearchSortBar({
  query,
  reverse,
  sort,
  options,
  searchKey,
  setQuery,
  setReverse,
  setSort,
  setFilters,
  actionBtn
}: Props): JSX.Element {
  const handleReverse = useCallback(() => {
    sort && setReverse((b) => !b);
  }, [setReverse, sort]);

  const handleSort = useCallback(
    (item: IItem | null) => {
      item ? setSort(item) : setSort(null);
    },
    [setSort]
  );

  const handleFilters = useCallback(() => {
    setFilters && setFilters((b) => !b);
  }, [setFilters]);

  const handleSearch = (value: string) => {
    value.length > 0 ? setQuery(value) : setQuery(null);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.search}>
        <label className={styles.svg} htmlFor="search-input">
          <SVG icon={GoSearch} />
        </label>
        <input
          id="search-input"
          type="search"
          autoComplete="off"
          value={query ? query : ''}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={`Search ${searchKey.toLowerCase()}...`}
        />
      </div>
      <div className={styles.sort}>
        <div className={styles.sortDD}>
          <Dropdown
            instanceId="select_sort"
            isClearable={true}
            value={sort}
            options={options}
            handleOnChange={handleSort}
            placeholder="Sort by..."
            borderColor="var(--gray-200)"
            placeholderFontSize="0.925rem"
            placeholderColor="var(--gray-400)"
          />
        </div>
        <button aria-label="Reverse" disabled={!sort} onClick={handleReverse}>
          <SVG
            icon={
              sort
                ? sort.value === 'numInstructions'
                  ? reverse
                    ? BsSortNumericUp
                    : BsSortNumericDown
                  : sort.value === 'date'
                  ? reverse
                    ? BsSortUp
                    : BsSortDown
                  : reverse
                  ? BsSortAlphaUp
                  : BsSortAlphaDown
                : reverse
                ? BsSortUp
                : BsSortDown
            }
          />
        </button>
        {setFilters && (
          <button aria-label="Filters" onClick={handleFilters}>
            <SVG icon={FiSliders} />
          </button>
        )}
      </div>
      {actionBtn && (
        <div className={styles.actionBtn}>
          <Button {...actionBtn}>{actionBtn.children}</Button>
        </div>
      )}
    </div>
  );
}

export default SearchSortBar;
