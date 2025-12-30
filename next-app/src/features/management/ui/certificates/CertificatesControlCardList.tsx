import { memo, useMemo, useState } from 'react';
import CertificatesCardList from '@features/shared/ui/certificates/CertificatesCardList';
import CertificatesControl from '@features/management/ui/certificates/CertificatesControl';
import { IItem } from '@features/shared/utils/interfaces';
import { certificateSearch } from '@features/shared/utils/helpers/helpers';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { Certificates } from '@features/shared/core/entities/Certificates';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';

type Props = {
  certificates: Certificates | null;
  tokenTypes: TokenTypes | null;
};

function CertificatesControlCardList(props: Props): JSX.Element {
  const [sort, setSort] = useState<IItem | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);

  const memoizedTokenTypes = useMemo(() => {
    const tokenTypes = props.tokenTypes && Object.values(props.tokenTypes);
    return tokenTypes;
  }, [props.tokenTypes]);

  const memoizedCertificates = useMemo(() => {
    const certificates = props.certificates && Object.values(props.certificates);
    return certificates;
  }, [props.certificates]);

  const filteredCertificates = useMemo(
    () =>
      memoizedCertificates && memoizedCertificates.length > 0 ? certificateSearch(memoizedCertificates, query) : null,
    [memoizedCertificates, query]
  );

  return (
    <>
      {memoizedTokenTypes === null ? (
        <FallbackMessage message="Creator members have to create types of tokens first so that the types can be certified" />
      ) : (
        <>
          <CertificatesControl
            tokenTypes={memoizedTokenTypes}
            reverse={reverse}
            sort={sort}
            query={query}
            setQuery={setQuery}
            setReverse={setReverse}
            setSort={setSort}
          />

          {filteredCertificates ? (
            <CertificatesCardList data={filteredCertificates} reverse={reverse} sort={sort} />
          ) : (
            <FallbackMessage message="There are no certificates to show" />
          )}
        </>
      )}
    </>
  );
}

export default memo(CertificatesControlCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return (
    JSON.stringify(prevProps.certificates) === JSON.stringify(nextProps.certificates) &&
    JSON.stringify(prevProps.tokenTypes) === JSON.stringify(nextProps.tokenTypes)
  );
}
