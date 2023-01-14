import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import styles from 'src/features/management/styles/modules/tokens/IdentifierTypeAmountCard.module.css';
import { FaTimes } from 'react-icons/fa';
import { IBaseTokenState } from 'next-app/src/features/management/utils/interfaces';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { isOliveGrower, isOliveOilMill } from 'next-app/src/shared/utils/constants';

type Props = IBaseTokenState & {
  moduleId: Module;
  handleDelToken: (id: string) => void;
  shouldNotConvert?: boolean;
};

const IdentifierTypeAmountCard = ({
  tokenId,
  tokenIdentifier,
  tokenTypeId,
  tokenAmount,
  moduleId,
  shouldNotConvert,
  handleDelToken
}: Props): JSX.Element => {
  return (
    <div className={styles.card}>
      <div className={styles.remove}>
        <button className={styles.removeBtn} onClick={() => handleDelToken(tokenTypeId.concat('_', tokenId))}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <h2>{`Batch ${tokenIdentifier}`}</h2>
      <p>
        <b>Type:</b> {tokenTypeId}
      </p>
      <p>
        <b>Amount:</b>{' '}
        {shouldNotConvert
          ? tokenAmount
          : `${
              isOliveGrower(moduleId)
                ? (tokenAmount / 1000).toString().concat(' kg')
                : isOliveOilMill(moduleId)
                ? (tokenAmount / 1000).toString().concat(' l')
                : tokenAmount
            }`}
      </p>
    </div>
  );
};

export default IdentifierTypeAmountCard;
