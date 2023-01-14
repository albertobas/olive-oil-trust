import styles from 'src/features/shared/styles/modules/page/Page.module.css';

type Props = { title: string; description: string };

function Intro({ title, description }: Props): JSX.Element {
  return (
    <div className={styles.layout}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export default Intro;
