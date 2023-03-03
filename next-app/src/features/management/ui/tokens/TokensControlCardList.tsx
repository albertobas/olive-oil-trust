import { useMemo, useState, memo } from 'react';
import TokensCardList from 'next-app/src/features/shared/ui/tokens/TokensCardList';
import TokensControl from 'next-app/src/features/management/ui/tokens/TokensControl';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import { tokenFilter, tokenSearch } from 'next-app/src/features/shared/utils/helpers/helpers';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { Module } from 'next-app/src/shared/utils/interfaces';
import {
  isIndependentCreator,
  isDistributor,
  isOliveOilMill,
  isBottlingPlant
} from 'next-app/src/shared/utils/constants';
import { Tokens } from 'next-app/src/features/shared/core/entities/Tokens';
import { TokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import FiltersToken from 'next-app/src/features/shared/ui/tokens/FiltersToken';

type Props = {
  tokens: Tokens | null;
  tokenTypes?: TokenTypes | null;
  moduleId?: Module;
};

function TokensControlCardList({ moduleId, ...rest }: Props): JSX.Element {
  const [query, setQuery] = useState<string | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [sort, setSort] = useState<IItem | null>(null);
  const [filters, setFilters] = useState<boolean>(false);
  const [typeItems, setTypeItems] = useState<IItem[] | null>(null);
  const [manufacturerItems, setManufacturerItems] = useState<IItem[] | null>(null);
  const [packerItems, setPackerItems] = useState<IItem[] | null>(null);
  const [selfProducedItem, setSelfProducedItem] = useState<IItem | null>(null);

  const memoizedTokens = useMemo(() => {
    const tokens = rest.tokens && Object.values(rest.tokens).filter((token) => token.balance != 0);

    const previousMemberTokens =
      rest.tokens && Object.values(rest.tokens).filter((token) => token.balance != 0 && token.selfProduced === false);

    const commercialTokens =
      rest.tokens &&
      Object.values(rest.tokens).filter((token) => token.balance != 0 && token.industrialUnitTokenInfo === null);

    const industrialUnitTokens =
      rest.tokens &&
      Object.values(rest.tokens).filter((token) => token.balance != 0 && token.industrialUnitTokenInfo !== null);

    return {
      tokens: tokens && tokens.length > 0 ? tokens : null,
      previousMemberTokens: previousMemberTokens && previousMemberTokens.length > 0 ? previousMemberTokens : null,
      commercialTokens: commercialTokens && commercialTokens.length > 0 ? commercialTokens : null,
      industrialUnitTokens: industrialUnitTokens && industrialUnitTokens.length > 0 ? industrialUnitTokens : null
    };
  }, [rest.tokens]);

  const tokenTypes = useMemo(() => {
    return rest.tokenTypes ? Object.values(rest.tokenTypes).map((type) => type) : null;
  }, [rest.tokenTypes]);

  // get filtered token types when querying
  const { tokens, previousMemberTokens, commercialTokens, industrialUnitTokens } = memoizedTokens;
  const filteredTokens = useMemo(
    () =>
      tokens && tokens.length > 0
        ? tokenFilter(tokenSearch(tokens, query), [
            { key: 'type', items: typeItems },
            { key: 'manufacturer', items: manufacturerItems },
            { key: 'selfProduced', items: selfProducedItem },
            { key: 'packer', items: packerItems }
          ])
        : null,
    [tokens, query, manufacturerItems, packerItems, selfProducedItem, typeItems]
  );

  const showControl = Boolean(
    moduleId
      ? isIndependentCreator(moduleId)
        ? true
        : isOliveOilMill(moduleId)
        ? previousMemberTokens || commercialTokens
        : isBottlingPlant(moduleId)
        ? previousMemberTokens || commercialTokens || industrialUnitTokens
        : isDistributor(moduleId)
        ? previousMemberTokens || industrialUnitTokens
        : previousMemberTokens || commercialTokens || industrialUnitTokens
      : commercialTokens
  );

  return (
    <>
      {showControl && (
        <TokensControl
          previousMemberTokens={previousMemberTokens}
          commercialTokens={commercialTokens}
          industrialUnitTokens={industrialUnitTokens}
          tokenTypes={tokenTypes}
          reverse={reverse}
          sort={sort}
          query={query}
          setQuery={setQuery}
          setReverse={setReverse}
          setSort={setSort}
          setFilters={setFilters}
        />
      )}
      {filteredTokens !== null ? (
        <>
          {filters && (
            <FiltersToken
              data={memoizedTokens.tokens}
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
      ) : (
        <FallbackMessage message="There are no tokens to show" />
      )}
    </>
  );
}

export default memo(TokensControlCardList, areEqual);

function areEqual(prevProps: Props, nextProps: Props) {
  return (
    JSON.stringify(prevProps.tokenTypes) === JSON.stringify(nextProps.tokenTypes) &&
    JSON.stringify(prevProps.tokens) === JSON.stringify(nextProps.tokens)
  );
}
