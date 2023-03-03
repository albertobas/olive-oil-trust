import { join } from 'path';
import React from 'react';
import { isOliveGrower, isOliveOilMill, pages } from 'next-app/src/shared/utils/constants';
import { Event } from 'next-app/src/features/shared/core/entities/Events';
import { Metadata } from 'next-app/src/features/shared/core/entities/Metadata';
import { TokenTypeInstruction } from 'next-app/src/features/shared/core/entities/TokenTypes';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'next-app/src/features/explore/styles/modules/tokenTypes/TokenTypeInfo.module.css';
import { getInstuctionTokenUnitFromModule } from 'next-app/src/features/management/utils/helpers';

type Props = {
  identifier: string;
  instructions: TokenTypeInstruction[] | null;
  metadata: Metadata | null;
  instructionsSetEvent?: Event | null;
};

function TokenTypeInfo({ identifier, metadata, instructions, instructionsSetEvent }: Props): JSX.Element {
  const eventDateUTC = instructionsSetEvent ? getUTCFromTimestamp(instructionsSetEvent.transaction.timestamp) : null;
  return (
    <>
      {metadata && (
        <>
          {metadata.bottle && (metadata.bottle.quality || metadata.bottle.material || metadata.bottle.size) && (
            <>
              <h2>Bottle information</h2>
              <ul className={styles.list}>
                {metadata.bottle.quality && (
                  <li>
                    <strong>Quality: </strong>
                    {metadata.bottle.quality}
                  </li>
                )}
                {metadata.bottle.material && (
                  <li>
                    <strong>Material: </strong>
                    {metadata.bottle.material}
                  </li>
                )}
                {metadata.bottle.size && (
                  <li>
                    <strong>Size: </strong>
                    {metadata.bottle.size}
                  </li>
                )}
              </ul>
            </>
          )}
          {metadata.olive && (metadata.olive.quality || metadata.olive.origin) && (
            <>
              <h2>Olive information</h2>
              <ul className={styles.list}>
                {metadata.olive.quality && (
                  <li>
                    <strong>Quality: </strong>
                    {metadata.olive.quality}
                  </li>
                )}
                {metadata.olive.origin && (
                  <li>
                    <strong>Origin: </strong>
                    {metadata.olive.origin}
                  </li>
                )}
              </ul>
            </>
          )}
          {metadata.oliveOil && (metadata.oliveOil.acidity || metadata.oliveOil.aroma) && (
            <>
              <h2>Olive oil information</h2>
              <ul className={styles.list}>
                {metadata.oliveOil.acidity && (
                  <li>
                    <strong>Acidity: </strong>
                    {metadata.oliveOil.acidity}
                  </li>
                )}
                {metadata.oliveOil.aroma && (
                  <li>
                    <strong>Aroma: </strong>
                    {metadata.oliveOil.aroma}
                  </li>
                )}
                {metadata.oliveOil.bitterness && (
                  <li>
                    <strong>Bitterness: </strong>
                    {metadata.oliveOil.bitterness}
                  </li>
                )}
                {metadata.oliveOil.colour && (
                  <li>
                    <strong>Colour: </strong>
                    {metadata.oliveOil.colour}
                  </li>
                )}
                {metadata.oliveOil.fruitness && (
                  <li>
                    <strong>Fruitness: </strong>
                    {metadata.oliveOil.fruitness}
                  </li>
                )}
                {metadata.oliveOil.intensity && (
                  <li>
                    <strong>Intensity: </strong>
                    {metadata.oliveOil.intensity}
                  </li>
                )}
                {metadata.oliveOil.itching && (
                  <li>
                    <strong>Itching: </strong>
                    {metadata.oliveOil.itching}
                  </li>
                )}
              </ul>
            </>
          )}
        </>
      )}

      {instructions && instructions.length > 0 && (
        <>
          <h2>Instructions</h2>
          <p>
            There is a set of instructions that are mandatory to follow in order to mint a token of this type, so you
            must possess the precise amount of the following token{instructions.length > 1 && 's'} in advance.
          </p>
          <p>
            If the instruction features a certificate instead of a token, then you need to own the right amount of any
            combination of tokens that are certified by that particular certificate.
          </p>
          <ul className={styles.listMargin}>
            {instructions.map((instruction) => {
              const instructionHref = join(
                instruction.isCertificate ? pages.CERTIFICATES.url : pages.TOKEN_TYPES.url,
                instruction.id
              );
              const unit = instruction.instructorModuleId
                ? getInstuctionTokenUnitFromModule(instruction.instructorModuleId)
                : null;
              return (
                <li key={instruction.id}>
                  {instruction.amount && (
                    <>
                      <span>
                        {instruction.instructorModuleId
                          ? isOliveGrower(instruction.instructorModuleId) ||
                            isOliveOilMill(instruction.instructorModuleId)
                            ? `${instruction.amount} ${unit}`
                            : `${instruction.amount} unit${instruction.amount > 1 ? 's' : ''}`
                          : instruction.amount}
                      </span>{' '}
                    </>
                  )}
                  <ILink
                    className={styles.anchor}
                    href={instructionHref}
                    aria-label={`${instruction.isCertificate ? 'Certificate' : 'Token type'} ${identifier}`}
                  >
                    {instruction.title ?? instruction.id}
                  </ILink>
                </li>
              );
            })}
          </ul>
          {eventDateUTC && <p>This instructions date from {eventDateUTC}</p>}
        </>
      )}
    </>
  );
}

export default TokenTypeInfo;
