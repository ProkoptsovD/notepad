import { useState, useEffect, useCallback } from 'react';
import styles from './workspace.module.css';

/**
 * @param {{
 *  title: string;
 *  creationDate: Date;
 *  text: string;
 *  id: string;
 *  onNoteChange: (note: { creationDate: Date; title: string; text: string; }) => void;
 *  dateFormatFn: (date: Date) => string;
 * }} props
 * @returns JSX.Element
 */
export function Workspace({ title, creationDate, text, id, onNoteChange, dateFormatFn }) {
  const [noteText, setNoteText] = useState(() => text);
  const [noteTitle, setNoteTitle] = useState(() => title);
  const tranformedDate = dateFormatFn(creationDate);

  const onNoteChangeCallback = useCallback(onNoteChange, [onNoteChange]);

  useEffect(() => {
    onNoteChangeCallback({ id, title: noteTitle, text: noteText, creationDate: new Date() });
  }, [noteText, noteTitle, id, onNoteChangeCallback]);

  function handleNoteTextChange({ currentTarget }) {
    setNoteText(currentTarget.value);
  }

  function handleNoteTitleChange({ currentTarget }) {
    setNoteTitle(currentTarget.value);
  }

  return (
    <section className={styles.workspace}>
      <time className={styles.date} dateTime={tranformedDate}>
        {tranformedDate}
      </time>
      <textarea
        className={`${styles.textarea} ${styles.title}`}
        value={noteTitle}
        onChange={handleNoteTitleChange}
        placeholder="Type in note title..."
      />

      <textarea
        className={`${styles.textarea} ${styles.text}`}
        value={noteText}
        onChange={handleNoteTextChange}
        placeholder="Type in note text..."
      />
    </section>
  );
}
