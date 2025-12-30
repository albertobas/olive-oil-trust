import { memo, useMemo, useState } from 'react';
import { IItem } from '@features/shared/utils/interfaces';
import SearchSortBar from '@features/shared/ui/search/SearchSortBar';
import { sortTokenCardsRecords } from '@features/shared/utils/constants';
import TokensCardList from '@features/shared/ui/tokens/TokensCardList';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { tokenFilter, tokenSearch } from '@features/shared/utils/helpers/helpers';
import { Tokens } from '@features/shared/core/entities/Tokens';
import FiltersToken from '@features/shared/ui/tokens/FiltersToken';

type Props = {
  tokens: Tokens | null;
};

function TokensSearchCardList({ tokens }: Props): JSX.Element {
  const [sort, setSort] = useState<IItem | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<boolean>(false);
  const [typeItems, setTypeItems] = useState<IItem[] | null>(null);
  const [manufacturerItems, setManufacturerItems] = useState<IItem[] | null>(null);
  const [packerItems, setPackerItems] = useState<IItem[] | null>(null);
  const [selfProducedItem, setSelfProducedItem] = useState<IItem | null>(null);

  const memoizedTokens = useMemo(() => {
    if (tokens) {
      return Object.values(tokens);
    }
    return null;
  }, [tokens]);

  const sortOptions = useMemo(() => {
    return Object.keys(sortTokenCardsRecords).map((key) => {
      return { label: sortTokenCardsRecords[key as keyof typeof sortTokenCardsRecords], value: key } as IItem;
    });
  }, []);

  const filteredTokens = useMemo(
    () =>
      memoizedTokens && memoizedTokens.length > 0
        ? tokenFilter(tokenSearch(memoizedTokens, query), [
            { key: 'type', items: typeItems },
            { key: 'manufacturer', items: manufacturerItems },
            { key: 'selfProduced', items: selfProducedItem },
            { key: 'packer', items: packerItems }
          ])
        : null,
    [memoizedTokens, query, manufacturerItems, packerItems, selfProducedItem, typeItems]
  );

  if (!filteredTokens) {
    return <FallbackMessage message="There are no tokens to show at the moment" />;
  }

  return (
    <>
      <SearchSortBar
        query={query}
        reverse={reverse}
        sort={sort}
        options={sortOptions}
        searchKey="tokens"
        setReverse={setReverse}
        setQuery={setQuery}
        setSort={setSort}
        setFilters={setFilters}
      />
      {filters && (
        <FiltersToken
          data={memoizedTokens}
          typeItems={typeItems}
          manufacturerItems={manufacturerItems}
          packerItems={packerItems}
          selfProducedItem={selfProducedItem}
          setTypeItems={setTypeItems}
          setManufacturerItems={setManufacturerItems}
          setPackerItems={setPackerItems}
          setSelfProducedItem={setSelfProducedItem}
        />
      )}
      <TokensCardList data={filteredTokens} reverse={reverse} sort={sort} />
    </>
  );
}

export default memo(TokensSearchCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return JSON.stringify(prevProps.tokens) === JSON.stringify(nextProps.tokens);
}
