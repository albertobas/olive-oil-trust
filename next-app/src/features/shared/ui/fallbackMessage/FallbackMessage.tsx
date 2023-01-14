import styles from 'next-app/src/features/shared/styles/modules/fallbackMessage/FallbackMessage.module.css';
import { VscLoading } from 'react-icons/vsc';
import { BiError } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';

type Props = {
  message?: string;
  error?: boolean;
  loading?: boolean;
};

function FallbackMessage({ message, error, loading }: Props): JSX.Element {
  return (
    <div className={loading ? styles.containerLoading : message || error ? styles.container : styles.containerLoading}>
      <SVG icon={loading ? VscLoading : error ? BiError : message ? BsInfoCircle : VscLoading} />
      <p>{message ? message : 'Loading'}</p>
    </div>
  );
}

export default FallbackMessage;
