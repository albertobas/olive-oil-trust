import styles from 'next-app/src/features/shared/styles/modules/escrows/EscrowCard.module.css';
import { join } from 'path';
import { isIndustrialUnitSeller, pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { IEscrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { IModalInfo } from 'next-app/src/features/shared/ui/utils/interfaces';
import { shouldShowAction } from 'next-app/src/features/shared/ui/utils/helpers';
import { Button } from 'next-app/src/features/shared/ui/buttons/Button';
import { getEscrowState, getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import { IContract } from 'next-app/src/features/shared/utils/interfaces';
import { getModuleFromRole } from 'next-app/src/features/management/utils/helpers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';

type Props = IEscrow & {
  userAddress: string | null;
  accountContract: IContract | null;
  setModalInfo: Dispatch<SetStateAction<IModalInfo | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const EscrowCard = ({
  id,
  buyer,
  buyerWallet,
  identifier,
  escrowBalance,
  etherBalance,
  seller,
  state,
  tokenDeposits,
  userAddress,
  accountContract,
  price,
  title,
  setIsModalOpen,
  setModalInfo
}: Props): JSX.Element => {
  function parsePrice(value: number): string {
    const bigValue = BigNumber.from(value.toString());
    if (value >= 1.0e15) {
      return `${formatEther(bigValue)} ETH`;
    }
    if (value >= 1.0e9) {
      return `${formatUnits(bigValue, 'gwei')} Gwei`;
    }
    return `${formatUnits(bigValue, 'wei')} Wei`;
  }

  function handleClick(modalInfo: IModalInfo) {
    setModalInfo(modalInfo);
    setIsModalOpen(true);
  }

  const { tokensInfo } = escrowBalance;
  const isSeller = Boolean(seller && seller.id === userAddress);
  const isIndustrialUnitSeller_ = seller && seller.role ? isIndustrialUnitSeller(getModuleFromRole(seller.role)) : null;

  return (
    <div className={styles.layout}>
      <div className={styles.description}>
        <div className={styles.info}>
          <h2>{title}</h2>
          {seller && (
            <p>
              <b>Seller:</b> {seller.name}
            </p>
          )}
          {buyer ? (
            <p>
              <b>{`${state === 'Closed' ? 'Buyer' : 'Buyer candidate'}`}:</b> {buyer.name ?? buyer.id}
            </p>
          ) : buyerWallet ? (
            <p>
              <b>{`${state === 'Closed' ? 'Buyer' : 'Buyer candidate'}`}:</b> {buyerWallet}
            </p>
          ) : (
            <></>
          )}
          {state && (
            <p>
              <b>State:</b> {getEscrowState(state)}
            </p>
          )}
          {tokensInfo && seller && (
            <>
              <p>
                <b>Token balance:</b>
              </p>
              <ul>
                {Object.keys(tokensInfo).map((id) => {
                  const tokenHref = join(pages.TOKENS.url, id);
                  const {
                    amount,
                    token: { identifier, tokenType }
                  } = tokensInfo[id];
                  return (
                    <li key={id}>
                      {isIndustrialUnitSeller_ ? (
                        <>
                          {amount === 0 && (
                            <>
                              <span>{amount}</span> x{' '}
                            </>
                          )}
                          <ILink href={tokenHref} aria-label={`Batch ${identifier}`}>
                            {`Pallet ${identifier}${
                              tokenType
                                ? ` (${tokenType.metadata ? tokenType.metadata.title : `#${tokenType.identifier}`})`
                                : ''
                            }`}
                          </ILink>
                        </>
                      ) : (
                        <>
                          <span>{`${
                            seller.role === 'OliveGrower'
                              ? `${amount / 1000} kg`
                              : seller.role === 'OliveOilMill'
                              ? `${amount / 1000} l`
                              : `${amount} units`
                          }`}</span>{' '}
                          x{' '}
                          <ILink href={tokenHref} aria-label={`Batch ${identifier}`}>
                            {`Batch ${identifier}${
                              tokenType
                                ? ` (${tokenType.metadata ? tokenType.metadata.title : `#${tokenType.identifier}`})`
                                : ''
                            }`}
                          </ILink>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {state === 'Active' && seller?.role !== 'OliveGrower'
            ? price !== null && (
                <p>
                  <b>Price:</b> {parsePrice(price)}
                </p>
              )
            : etherBalance.valueExact !== null && (
                <p>
                  <b>Ether balance:</b> {parsePrice(etherBalance.valueExact)}
                </p>
              )}
        </div>
        {<p>{getUTCFromTimestamp(tokenDeposits[0].transaction.timestamp)}</p>}
      </div>
      <div className={styles.actionBtns}>
        {shouldShowAction(accountContract, seller, 'revertBeforePayment', state, isSeller) && (
          <Button
            onClick={() => handleClick({ escrowId: id, escrowIdentifier: identifier, action: 'revertBeforePayment' })}
          >
            Revert
          </Button>
        )}
        {shouldShowAction(accountContract, seller, 'revertAfterPayment', state, isSeller) && (
          <Button
            onClick={() => handleClick({ escrowId: id, escrowIdentifier: identifier, action: 'revertAfterPayment' })}
          >
            Revert
          </Button>
        )}
        {shouldShowAction(accountContract, seller, 'closeEscrow', state, isSeller) && (
          <Button onClick={() => handleClick({ escrowId: id, escrowIdentifier: identifier, action: 'closeEscrow' })}>
            Close
          </Button>
        )}
        {shouldShowAction(accountContract, seller, 'cancelPayment', state, isSeller) && (
          <Button onClick={() => handleClick({ escrowId: id, escrowIdentifier: identifier, action: 'cancelPayment' })}>
            Cancel Payment
          </Button>
        )}
        {shouldShowAction(accountContract, seller, 'makeOffer', state, isSeller) && (
          <Button onClick={() => handleClick({ escrowId: id, escrowIdentifier: identifier, action: 'makeOffer' })}>
            Make offer
          </Button>
        )}
        {shouldShowAction(accountContract, seller, 'makePayment', state, isSeller) && (
          <Button onClick={() => handleClick({ escrowId: id, escrowIdentifier: identifier, action: 'makePayment' })}>
            Make payment
          </Button>
        )}
      </div>
    </div>
  );
};

export default EscrowCard;
