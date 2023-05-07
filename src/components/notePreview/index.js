import styles from './notePreview.module.css';

/**
 * @param {{
 *  title: string;
 *  text: string;
 *  creationDate: Date;
 *  onClick: () => void;
 *  isActive: boolean;
 *  dateFormatFn: (date: Date) => string;
 * }}
 * @returns JSX.Element
 */
export function NotePreview({ title, text, creationDate, isActive, onClick, dateFormatFn }) {
  const dateTime = creationDate ? dateFormatFn(creationDate) : null;
  const className = `${styles.notePreview} ${isActive ? styles.active : ''}`;

  return (
    <article className={className} onClick={onClick}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.dateAndTextWrapper}>
        <time className={styles.creationDate} dateTime={dateTime}>
          {dateTime}
        </time>
        <p className={styles.text}>{text || 'Empty note'}</p>
      </div>
    </article>
  );
}
