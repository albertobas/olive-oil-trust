import { IModalInfo } from 'next-app/src/features/shared/ui/utils/interfaces';
import { toast } from 'react-toastify';
import { transferEscrowActions } from 'next-app/src/features/shared/ui/utils/helpers';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import useSignedContract from 'next-app/src/features/shared/ui/hooks/useSignedContract';
import { Dispatch, SetStateAction } from 'react';
import { Escrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import styles from 'next-app/src/features/shared/styles/modules/escrows/EscrowActionsConfirmation.module.css';

type Props = {
  escrow: Escrow;
  modalInfo: IModalInfo;
  isMember: boolean;
  setModalInfo: Dispatch<SetStateAction<IModalInfo | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function EscrowActionsConfirmation({ escrow, modalInfo, isMember, setModalInfo, setIsModalOpen }: Props): JSX.Element {
  const signedMemberContract = useSignedMemberContract();
  const { identifier, seller } = escrow;
  const signedEscrowContract = useSignedContract(
    seller && seller.name ? seller.name.replace(/ /g, '') + 'Escrow' : null
  );

  function handleConfirm() {
    const toastId = toast.loading('Waiting for wallet response...');
    transferEscrowActions(signedMemberContract.data, signedEscrowContract.data, escrow, modalInfo, isMember)
      .then(() => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(
          `The transaction has succeeded.\n${
            modalInfo.action === 'revertBeforePayment' || modalInfo.action === 'revertAfterPayment'
              ? 'The escrow has been reverted'
              : modalInfo.action === 'closeEscrow'
              ? 'The escrow has been closed'
              : modalInfo.action === 'cancelPayment'
              ? 'The deposit of ether has been cancelled'
              : ''
          }.`
        );
      })
      .catch((error) => {
        renderToast(toastId, 'The transaction has failed.', error);
        console.error(
          `The transaction has failed.${error.code ? `\nError code: ${error.code}` : ''}\nError message: ${
            error.message
          }`
        );
      })
      .finally(() => {
        setIsModalOpen(false);
        setModalInfo(null);
      });
  }

  return (
    <div className={styles.layout}>
      <p>{`Are you sure you want to ${
        modalInfo.action === 'revertBeforePayment' || modalInfo.action === 'revertAfterPayment'
          ? 'revert the escrow'
          : modalInfo.action === 'closeEscrow'
          ? 'close the escrow'
          : modalInfo.action === 'cancelPayment'
          ? 'cancel the deposit of ether in the escrow'
          : ''
      } ${identifier}?`}</p>
      <div className={styles.actionBtns}>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

export default EscrowActionsConfirmation;
