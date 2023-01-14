import { useTokenById } from 'next-app/src/features/explore/ui/hooks/useTokenById';
import Image from 'next/image';
import styles from 'next-app/src/features/explore/styles/modules/tokens/TokenById.module.css';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { Fragment } from 'react';
import AncestryTokenCard from 'next-app/src/features/explore/ui/tokens/AncestryTokenCard';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { Role } from 'next-app/src/features/shared/utils/interfaces';
import { pages, roles } from 'next-app/src/shared/utils/constants';
import TokenCard from 'next-app/src/features/shared/ui/tokens/TokenCard';
import Xarrow, { Xwrapper } from 'react-xarrows';
import TokenTypeInfo from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeInfo';
import { join } from 'path';

function TokenById({ id }: { id: string }): JSX.Element {
  const { error, data } = useTokenById(id);

  if (error) {
    return <FallbackMessage message="Tokens could not be retrieved" error />;
  }

  if (error === false) {
    if (data && data.tokens && Object.keys(data.tokens).includes(id)) {
      const token = data.tokens[id];
      const { identifier, ancestry, industrialUnitTokenInfo, mintingDate, selfProduced, tokenType } = data.tokens[id];
      const date = mintingDate ? getUTCFromTimestamp(mintingDate) : null;
      const memberRole =
        tokenType && tokenType.member && tokenType.member.role ? roles[tokenType.member.role as Role] : null;
      const memberName = tokenType && tokenType.member && tokenType.member.name ? tokenType.member.name : null;
      const commercialUnits = industrialUnitTokenInfo ? industrialUnitTokenInfo.commercialUnits : null;

      return (
        <div className={styles.layout}>
          <h1>{`${industrialUnitTokenInfo ? 'Pallet' : 'Batch'} ${identifier}`}</h1>
          <div className={styles.introLayout}>
            <div className={styles.description}>
              {tokenType && tokenType.metadata && tokenType.metadata.title && (
                <p>
                  <b>Type:</b> {tokenType.metadata.title}
                </p>
              )}
              {tokenType && (
                <p>
                  <b>Type Identifier:</b> {tokenType.identifier}
                </p>
              )}
              {!selfProduced && memberName && (
                <p>
                  <b>Manufacturer:</b> {`${memberName} ${memberRole ? `(${memberRole})` : ''}`}
                </p>
              )}
              {!selfProduced && industrialUnitTokenInfo && industrialUnitTokenInfo.member && (
                <p>
                  <b>Packer:</b> {industrialUnitTokenInfo.member.name}
                </p>
              )}
              {date && (
                <p>
                  <b>Date:</b> {date}
                </p>
              )}
              {tokenType && tokenType.metadata && tokenType.metadata.description && (
                <p>
                  <b>Description:</b> {tokenType?.metadata?.description}
                </p>
              )}
            </div>
            {tokenType && tokenType.metadata && tokenType.metadata.image && tokenType.metadata.image.path && (
              <div>
                <Image
                  src={tokenType.metadata.image.path}
                  alt={tokenType.metadata.title ? tokenType.metadata.title : undefined}
                  width={250}
                  height={250}
                  quality={100}
                />
              </div>
            )}
          </div>
          {tokenType && (
            <TokenTypeInfo
              identifier={tokenType.identifier}
              instructions={tokenType.instructions}
              instructionsSetEvent={tokenType.instructionsSetEvent}
              metadata={tokenType.metadata}
            />
          )}
          {industrialUnitTokenInfo && (
            <>
              <h2>Content</h2>
              <p>This pallet contains the following items</p>
              <ul className={styles.listMargin}>
                {commercialUnits &&
                  Object.keys(commercialUnits).map((key) => {
                    const { amount, token } = commercialUnits[key];
                    const commercialUnitHref = join(pages.TOKENS.url, token.id);
                    const title = token.tokenType?.metadata?.title
                      ? `Batch ${token.identifier} ${token.tokenType.metadata.title}`
                      : `Batch ${token.identifier}${token.tokenType ? ` Type ${token.tokenType.identifier}` : ''}`;
                    return (
                      <li key={token.id}>
                        {amount && (
                          <>
                            <span>{amount}</span> x{' '}
                          </>
                        )}
                        <ILink href={commercialUnitHref} aria-label={`Batch ${identifier.toString()}`}>
                          {title}
                        </ILink>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
          {ancestry && (
            <>
              <h2>Ancestry</h2>
              <div className={styles.ancestryLayout}>
                <div className={styles.ancestry}>
                  <Xwrapper>
                    {ancestry.map((firstAncestryToken) => {
                      return (
                        <div key={firstAncestryToken.token.id} className={styles.firstAncestry}>
                          {firstAncestryToken.token.ancestry && (
                            <div className={styles.secondAncestry}>
                              {firstAncestryToken.token.ancestry.map((secondAncestryToken) => {
                                return (
                                  <Fragment key={secondAncestryToken.token.id}>
                                    <div id={secondAncestryToken.token.id} className={styles.cardWrapper}>
                                      <AncestryTokenCard
                                        amount={secondAncestryToken.amount}
                                        {...secondAncestryToken.token}
                                      />
                                    </div>
                                    <Xarrow
                                      start={secondAncestryToken.token.id}
                                      startAnchor="bottom"
                                      end={firstAncestryToken.token.id}
                                      color="#000"
                                      strokeWidth={2}
                                      headSize={8}
                                      path="grid"
                                      zIndex={1}
                                    />
                                  </Fragment>
                                );
                              })}
                            </div>
                          )}
                          <div id={firstAncestryToken.token.id} className={styles.cardWrapper}>
                            <AncestryTokenCard amount={firstAncestryToken.amount} {...firstAncestryToken.token} />
                          </div>

                          <Xarrow
                            start={firstAncestryToken.token.id}
                            startAnchor="bottom"
                            end={token.id}
                            color="#000"
                            strokeWidth={2}
                            headSize={8}
                            curveness={1}
                            path="grid"
                            zIndex={1}
                          />
                        </div>
                      );
                    })}
                  </Xwrapper>
                </div>
                <div id={token.id} className={styles.cardWrapper}>
                  <TokenCard {...token} />
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
    return <FallbackMessage message={`The token ${id} does not exist`} error />;
  }

  return <FallbackMessage />;
}

export default TokenById;
