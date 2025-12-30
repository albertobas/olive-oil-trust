import type { NextPage } from 'next';
import styles from '@app/styles/modules/home/Home.module.css';

const Custom404: NextPage = () => {
  return <div className={styles.layout}>404: Page not found</div>;
};

export default Custom404;
