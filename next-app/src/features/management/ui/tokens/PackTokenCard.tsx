import React from 'react';
import SVG from '@features/shared/ui/svg/SVG';
import styles from '@features/management/styles/modules/tokens/PackTokenCard.module.css';
import { FaTimes } from 'react-icons/fa';
import { IPackTokenState } from '@features/management/utils/interfaces';

type Props = IPackTokenState & {
  handleDelToken: (id: string) => void;
};

const PackTokenCard = ({ packId, tokenAmounts, tokenIds, tokenTypeIds, handleDelToken }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.remove}>
        <button className={styles.removeBtn} onClick={() => handleDelToken(packId)}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <h2>{`Pallet ${packId}`}</h2>
      <h3>Content</h3>
      <ul>
        {tokenIds.map((id, idx) => {
          const typeId = tokenTypeIds[idx] ?? null;
          return (
            <li key={idx + (typeId ? typeId : '') + tokenIds[idx]}>{`${tokenAmounts[idx]} x Batch ${id}${
              typeId ? ` #${typeId}` : ''
            }`}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default React.memo(PackTokenCard);
