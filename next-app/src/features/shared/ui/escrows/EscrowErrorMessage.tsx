import { Dispatch, SetStateAction } from 'react';
import styles from 'next-app/src/features/shared/styles/modules/escrows/EscrowActionsConfirmation.module.css';

type Props = {
  error: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function EscrowErrorMessage({ error, setIsModalOpen }: Props): JSX.Element {
  return (
    <div className={styles.layout}>
      <p>{error}</p>
      <div className={styles.actionBtns}>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </div>
    </div>
  );
}

export default EscrowErrorMessage;
