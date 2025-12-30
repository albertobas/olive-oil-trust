import { memo, useMemo, useState } from 'react';
import SearchSortBar from '@features/shared/ui/search/SearchSortBar';
import { IItem } from '@features/shared/utils/interfaces';
import { certificateSearch } from '@features/shared/utils/helpers/helpers';
import CertificatesCardList from '@features/shared/ui/certificates/CertificatesCardList';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { sortCertificateCardsRecords } from '@features/shared/utils/constants';
import { Certificates } from '@features/shared/core/entities/Certificates';

type Props = { certificates: Certificates | null };

function CertificatesSearchCardList({ certificates }: Props): JSX.Element {
  const [sort, setSort] = useState<IItem | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);

  const memoizedCertificates = useMemo(() => {
    if (certificates) {
      return Object.values(certificates);
    }
    return null;
  }, [certificates]);

  const sortOptions = useMemo(() => {
    return Object.keys(sortCertificateCardsRecords).map((key) => {
      return {
        label: sortCertificateCardsRecords[key as keyof typeof sortCertificateCardsRecords],
        value: key
      } as IItem;
    });
  }, []);

  // get filtered token types when querying
  const filteredCertificates = useMemo(
    () =>
      memoizedCertificates && memoizedCertificates.length > 0 ? certificateSearch(memoizedCertificates, query) : null,
    [memoizedCertificates, query]
  );

  if (!filteredCertificates) {
    return <FallbackMessage message="There are no certificates to show at the moment" />;
  }

  return (
    <>
      <SearchSortBar
        query={query}
        reverse={reverse}
        sort={sort}
        options={sortOptions}
        searchKey="certificates"
        setReverse={setReverse}
        setQuery={setQuery}
        setSort={setSort}
      />
      <CertificatesCardList data={filteredCertificates} reverse={reverse} sort={sort} />
    </>
  );
}

export default memo(CertificatesSearchCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return JSON.stringify(prevProps.certificates) === JSON.stringify(nextProps.certificates);
}
