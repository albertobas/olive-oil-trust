import styles from '@features/shared/styles/modules/escrows/EscrowsCardList.module.css';
import { useEffect, useMemo, useState } from 'react';
import { sortEscrowArray } from '@features/shared/utils/helpers/escrow';
import { IItem } from '@features/shared/utils/interfaces';
import EscrowCard from '@features/shared/ui/escrows/EscrowCard';
import { Escrow } from '@features/shared/core/entities/Escrows';
import useAppSelector from '@shared/ui/hooks/useAppSelector';
import ReactModal from 'react-modal';
import MakePayment from '@features/shared/ui/escrows/MakePayment';
import MakeOffer from '@features/shared/ui/escrows/MakeOffer';
import EscrowActionsConfirmation from '@features/shared/ui/escrows/EscrowActionsConfirmation';
import { IModalInfo } from '@features/shared/ui/utils/interfaces';

type Props = {
  escrows: Escrow[] | null;
  reverse: boolean;
  sort: IItem | null;
};

function EscrowsCardList({ escrows, reverse, sort }: Props): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<IModalInfo | null>(null);
  const [stateData, setStateData] = useState<Escrow[] | null>(
    escrows ? (sort ? sortEscrowArray(escrows.slice(), sort.value, reverse) : escrows) : null
  );
  const escrow = useMemo(() => {
    const escrow = escrows && modalInfo ? escrows.find((escrow) => escrow.id === modalInfo.escrowId) : null;
    return escrow ? escrow : null;
  }, [escrows, modalInfo]);

  useEffect(() => {
    setStateData(escrows ? (sort ? sortEscrowArray(escrows.slice(), sort.value, reverse) : escrows) : null);
  }, [escrows, reverse, sort]);

  const { data } = useAppSelector((state) => state.account);

  const isMember = data ? data.contract !== null : false;
  // if user is member (i.e. data.contract !== null) assign contract address, else assign metamask account address
  const userAddress = data ? (data.contract ? data.contract.address : data.account) : null;
  const moduleId = data && data.contract && data.contract.moduleId;
  const accountContract = data && data.contract;

  return (
    <div className={styles.layout}>
      {stateData &&
        stateData.map((escrow) => (
          <EscrowCard
            key={escrow.id}
            accountContract={accountContract}
            userAddress={userAddress}
            setIsModalOpen={setIsModalOpen}
            setModalInfo={setModalInfo}
            {...escrow}
          />
        ))}

      <ReactModal
        isOpen={isModalOpen}
        className={
          modalInfo
            ? modalInfo.action === 'makePayment' || modalInfo.action === 'makeOffer'
              ? styles.modal
              : styles.modalSm
            : undefined
        }
        overlayClassName="overlay"
      >
        {modalInfo &&
          escrow &&
          ((moduleId === 'BottlingPlantUpgradeable' ||
            moduleId === 'DistributorUpgradeable' ||
            moduleId === 'RetailerUpgradeable' ||
            moduleId === null) &&
          modalInfo.action === 'makePayment' ? (
            <MakePayment
              escrow={escrow}
              moduleId={moduleId}
              setIsModalOpen={setIsModalOpen}
              setModalInfo={setModalInfo}
            />
          ) : modalInfo.action === 'makeOffer' ? (
            <MakeOffer escrow={escrow} setIsModalOpen={setIsModalOpen} setModalInfo={setModalInfo} />
          ) : (
            <EscrowActionsConfirmation
              escrow={escrow}
              modalInfo={modalInfo}
              isMember={isMember}
              setIsModalOpen={setIsModalOpen}
              setModalInfo={setModalInfo}
            />
          ))}
      </ReactModal>
    </div>
  );
}

export default EscrowsCardList;
