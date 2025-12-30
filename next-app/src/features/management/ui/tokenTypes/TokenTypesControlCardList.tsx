import { memo, useMemo, useState } from 'react';
import TokenTypesControl from '@features/management/ui/tokenTypes/TokenTypesControl';
import TokenTypesCardList from '@features/shared/ui/tokenTypes/TokenTypesCardList';
import { IItem } from '@features/shared/utils/interfaces';
import { tokenTypeSearch } from '@features/shared/utils/helpers/helpers';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import { isIndependentCreator } from '@shared/utils/constants';
import { Module } from '@shared/utils/interfaces';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';
import { Certificates } from '@features/shared/core/entities/Certificates';

type Props = {
  tokenTypes: TokenTypes | null;
  certificates: Certificates | null;
  memberAddress: string;
  moduleId: Module;
  previousRoles?: string[];
};

function TokenTypesControlCardList({ memberAddress, moduleId, previousRoles, ...rest }: Props): JSX.Element {
  const [sort, setSort] = useState<IItem | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [query, setQuery] = useState<string | null>(null);

  const memoizedTokenTypes = useMemo(() => {
    const tokenTypes = rest.tokenTypes
      ? Object.values(rest.tokenTypes).filter((type) => type.member?.id === memberAddress)
      : null;

    const previousTokenTypes =
      previousRoles && rest.tokenTypes
        ? Object.values(rest.tokenTypes).filter((type) => type.member?.role && previousRoles.includes(type.member.role))
        : null;

    return { tokenTypes, previousTokenTypes };
  }, [rest.tokenTypes, memberAddress, previousRoles]);

  const { previousTokenTypes, tokenTypes } = memoizedTokenTypes;

  const memoizedCertificates = useMemo(() => {
    if (previousTokenTypes) {
      const previousTokenTypesIds = previousTokenTypes.map((type) => type.id);
      const filteredCertificates = rest.certificates
        ? Object.values(rest.certificates)
            .map((certificate) => certificate)
            // filter array of certificates to only those that certify previous token types
            .filter((certificate) => {
              // get ids of the token types certified by the given certificate
              const certificateTokenTypesIds = certificate.tokenTypes && certificate.tokenTypes.map((type) => type.id);
              return previousTokenTypesIds
                .map<boolean>((type) => (certificateTokenTypesIds ? certificateTokenTypesIds.includes(type) : false))
                .reduce((a, b) => a || b, false);
            })
        : null;
      return filteredCertificates;
    }
    return null;
  }, [rest.certificates, previousTokenTypes]);

  const filteredTokenTypes = useMemo(
    () => (tokenTypes && tokenTypes.length > 0 ? tokenTypeSearch(tokenTypes, query) : null),
    [tokenTypes, query]
  );

  return (
    <>
      {isIndependentCreator(moduleId) ? (
        filteredTokenTypes ? (
          <>
            <TokenTypesControl
              previousTokenTypes={previousTokenTypes}
              certificates={memoizedCertificates}
              reverse={reverse}
              sort={sort}
              query={query}
              setQuery={setQuery}
              setReverse={setReverse}
              setSort={setSort}
            />
            <TokenTypesCardList data={filteredTokenTypes} reverse={reverse} sort={sort} />
          </>
        ) : (
          <FallbackMessage message="There are no types to show" />
        )
      ) : rest.tokenTypes || rest.certificates ? (
        <>
          {(previousTokenTypes || memoizedCertificates) && (
            <TokenTypesControl
              previousTokenTypes={previousTokenTypes}
              certificates={memoizedCertificates}
              reverse={reverse}
              sort={sort}
              query={query}
              setQuery={setQuery}
              setReverse={setReverse}
              setSort={setSort}
            />
          )}
          {filteredTokenTypes ? (
            <TokenTypesCardList data={filteredTokenTypes} reverse={reverse} sort={sort} />
          ) : (
            <FallbackMessage message="There are no types to show" />
          )}
        </>
      ) : (
        <FallbackMessage
          message={
            'There are no types to show and new types cannot be created since other types or certificates' +
            ' from previous members have still not been created. These previous types or certificates are' +
            ' needed to create instructions for your types.'
          }
        />
      )}
    </>
  );
}

export default memo(TokenTypesControlCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return (
    JSON.stringify(prevProps.tokenTypes) === JSON.stringify(nextProps.tokenTypes) &&
    JSON.stringify(prevProps.certificates) === JSON.stringify(nextProps.certificates)
  );
}
