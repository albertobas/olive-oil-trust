import styles from '@features/shared/styles/modules/page/Page.module.css';

type Props = { title: string; description: string; note?: string };

function Intro({ title, description, note }: Props): JSX.Element {
  return (
    <div className={styles.layout}>
      <h1>{title}</h1>
      <p>{description}</p>
      {note && (
        <p className={styles.textSm}>
          <b>Note:</b> {note}
        </p>
      )}
    </div>
  );
}

export default Intro;
