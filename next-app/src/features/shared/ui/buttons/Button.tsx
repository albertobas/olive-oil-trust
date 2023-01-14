import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import styles from 'src/features/shared/styles/modules/buttons/Button.module.css';

export const Button: FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (
  props
): JSX.Element => {
  return <button className={styles.btn} {...props} />;
};
