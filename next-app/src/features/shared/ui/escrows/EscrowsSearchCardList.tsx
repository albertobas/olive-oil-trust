import { memo, useMemo, useState } from 'react';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import SearchSortBar from 'next-app/src/features/shared/ui/search/SearchSortBar';
import { sortEscrowCardsRecords } from 'next-app/src/features/shared/utils/constants';
import { escrowFilter, escrowSearch } from 'next-app/src/features/shared/utils/helpers/helpers';
import EscrowsCardList from 'next-app/src/features/shared/ui/escrows/EscrowsCardList';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { Escrows } from 'next-app/src/features/shared/core/entities/Escrows';
import FiltersEscrow from 'next-app/src/features/shared/ui/escrows/FiltersEscrow';

type Props = {
  escrows: Escrows | null;
};

function EscrowsSearchCardList({ escrows }: Props): JSX.Element {
  const [sort, setSort] = useState<IItem | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<boolean>(false);
  const [stateItems, setStateItems] = useState<IItem[] | null>(null);
  const [buyerItems, setBuyerItems] = useState<IItem[] | null>(null);
  const [sellerItems, setSellerItems] = useState<IItem[] | null>(null);

  const memoizedEscrows = useMemo(() => {
    if (escrows) {
      return Object.values(escrows);
    }
    return null;
  }, [escrows]);

  const sortOptions = useMemo(() => {
    return Object.keys(sortEscrowCardsRecords).map((key) => {
      return { label: sortEscrowCardsRecords[key as keyof typeof sortEscrowCardsRecords], value: key } as IItem;
    });
  }, []);

  const filteredEscrows = useMemo(
    () =>
      memoizedEscrows && memoizedEscrows.length > 0
        ? escrowFilter(escrowSearch(memoizedEscrows, query), [
            { key: 'buyer', items: buyerItems },
            { key: 'seller', items: sellerItems },
            { key: 'state', items: stateItems }
          ])
        : null,
    [memoizedEscrows, query, buyerItems, sellerItems, stateItems]
  );

  if (!filteredEscrows) {
    return <FallbackMessage message="There are no escrows to show at the moment" />;
  }

  return (
    <>
      <SearchSortBar
        query={query}
        reverse={reverse}
        sort={sort}
        options={sortOptions}
        searchKey="escrows"
        setReverse={setReverse}
        setQuery={setQuery}
        setSort={setSort}
        setFilters={setFilters}
      />
      {filters && (
        <FiltersEscrow
          data={memoizedEscrows}
          stateItems={stateItems}
          buyerItems={buyerItems}
          sellerItems={sellerItems}
          setStateItems={setStateItems}
          setBuyerItems={setBuyerItems}
          setSellerItems={setSellerItems}
        />
      )}
      <EscrowsCardList escrows={filteredEscrows} reverse={reverse} sort={sort} />
    </>
  );
}

export default memo(EscrowsSearchCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return JSON.stringify(prevProps.escrows) === JSON.stringify(nextProps.escrows);
}
