import styles from './modal.module.css';

/**
 * @param {{
 *  text: string;
 *  onConfirm: () => void;
 *  onCancel: () => void;
 * }} props
 * @returns
 */
export function Modal({ text = 'Default text', onConfirm, onCancel }) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <strong className={styles.text}>{text}</strong>
        <div className={styles.buttonsWrapper}>
          <button
            type="button"
            onClick={onConfirm}
            className={`${styles.button} ${styles.confirm}`}
          >
            Yes
          </button>
          <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancel}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
