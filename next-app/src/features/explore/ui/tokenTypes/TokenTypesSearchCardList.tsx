import { memo, useMemo, useState } from 'react';
import { IItem } from '@features/shared/utils/interfaces';
import SearchSortBar from '@features/shared/ui/search/SearchSortBar';
import { sortTokenTypeCardsRecords } from '@features/shared/utils/constants';
import TokenTypesCardList from '@features/shared/ui/tokenTypes/TokenTypesCardList';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { tokenTypeFilter, tokenTypeSearch } from '@features/shared/utils/helpers/helpers';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';
import FiltersTokenType from '@features/management/ui/tokenTypes/FiltersTokenType';

type Props = {
  tokenTypes: TokenTypes | null;
};

function TokenTypesSearchCardList({ tokenTypes }: Props): JSX.Element {
  const [sort, setSort] = useState<IItem | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<boolean>(false);
  const [roleItems, setRoleItems] = useState<IItem[] | null>(null);

  const memoizedTokenTypes = useMemo(() => {
    if (tokenTypes) {
      return Object.values(tokenTypes);
    }
    return null;
  }, [tokenTypes]);

  const sortOptions = useMemo(() => {
    return Object.keys(sortTokenTypeCardsRecords).map((key) => {
      return { label: sortTokenTypeCardsRecords[key as keyof typeof sortTokenTypeCardsRecords], value: key } as IItem;
    });
  }, []);

  const filteredTokenTypes = useMemo(
    () =>
      memoizedTokenTypes && memoizedTokenTypes.length > 0
        ? tokenTypeFilter(tokenTypeSearch(memoizedTokenTypes, query), [{ key: 'member', items: roleItems }])
        : null,
    [memoizedTokenTypes, query, roleItems]
  );

  if (!filteredTokenTypes) {
    return <FallbackMessage message="There are no token types to show at the moment" />;
  }

  return (
    <>
      <SearchSortBar
        query={query}
        reverse={reverse}
        sort={sort}
        options={sortOptions}
        searchKey="token types"
        setReverse={setReverse}
        setQuery={setQuery}
        setSort={setSort}
        setFilters={setFilters}
      />
      {filters && <FiltersTokenType data={memoizedTokenTypes} roleItems={roleItems} setRoleItems={setRoleItems} />}
      <TokenTypesCardList data={filteredTokenTypes} reverse={reverse} sort={sort} />
    </>
  );
}

export default memo(TokenTypesSearchCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return JSON.stringify(prevProps.tokenTypes) === JSON.stringify(nextProps.tokenTypes);
}
