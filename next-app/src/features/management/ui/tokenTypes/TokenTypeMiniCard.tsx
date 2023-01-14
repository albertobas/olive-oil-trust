import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import styles from 'src/features/management/styles/modules/tokenTypes/TokenTypeMiniCard.module.css';
import { FaTimes } from 'react-icons/fa';
import { IAddTokenTypeState } from 'next-app/src/features/management/utils/interfaces';
import { isOliveGrower, isOliveOilMill } from 'next-app/src/shared/utils/constants';
import { getInstuctionTokenUnitFromModule } from 'next-app/src/features/management/ui/utils/helpers';

type Props = IAddTokenTypeState & {
  handleDelTokenType: (id: string) => void;
};

const TokenTypeMiniCard = ({
  id,
  instructedTitles,
  instructedIds,
  instructedAmounts,
  instructedTypeModules,
  handleDelTokenType
}: Props): JSX.Element => {
  return (
    <div className={styles.card}>
      <div className={styles.remove}>
        <button className={styles.removeBtn} onClick={() => handleDelTokenType(id)}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <h2>{id}</h2>
      <h3>Instructions</h3>
      <ul>
        {instructedTitles.map((title, idx) => {
          const moduleId = instructedTypeModules[idx];
          const amount = instructedAmounts[idx];
          const unit = getInstuctionTokenUnitFromModule(moduleId);
          return (
            <li key={instructedIds[idx]}>
              {`${isOliveGrower(moduleId) || isOliveOilMill(moduleId) ? `${amount} ${unit}` : amount}`} x {title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TokenTypeMiniCard;
