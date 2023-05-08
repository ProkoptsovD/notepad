import React, { useEffect, useRef, useState } from 'react';
import styles from './workspace.module.css';

/**
 * @param {{
 *  title: string;
 *  creationDate: Date;
 *  text: string;
 *  id: string;
 *  onNoteChange: (id: string; note: { id: string; creationDate: Date; title: string; text: string; }) => void;
 *  dateFormatFn: (date: Date) => string;
 *  editMode: boolean;
 *  isSaved: boolean;
 *  showEditBadge: boolean;
 *  showBacklink: boolean;
 *  savedBadgePosition: 'left' | 'right';
 *  onBacklinkClick: () => void;
 *  SavedBadgeComponent: React.FunctionComponent<{}>
 *  ModeBadgeComponent: React.FunctionComponent<{}>
 *  BacklinkComponent: React.FunctionComponent<{}>
 * }} props
 * @returns JSX.Element
 */
export function Workspace({
  title,
  creationDate,
  text,
  id,
  editMode = false,
  isSaved,
  showEditBadge = true,
  showBacklink = false,
  savedBadgePosition,
  onNoteChange,
  dateFormatFn,
  onBacklinkClick,
  ModeBadgeComponent = ModeBadge,
  SavedBadgeComponent = SavedBadge,
  BacklinkComponent = Backlink
}) {
  const [noteText, setNoteText] = useState(text);
  const [noteTitle, setNoteTitle] = useState(title);
  const [showSavedBadge, setShowSavedBadge] = useState(false);
  const timoutId = useRef();
  const tranformedDate = creationDate ? dateFormatFn(creationDate) : null;

  useEffect(() => {
    setNoteText(text);
    setNoteTitle(title);
  }, [text, title]);

  useEffect(() => {
    if (isSaved) {
      setShowSavedBadge(true);
      clearTimeout(timoutId.current);

      timoutId.current = setTimeout(() => {
        setShowSavedBadge(false);
      }, 1000);
    }
  }, [isSaved]);

  function handleNoteTitleChange({ currentTarget }) {
    setNoteTitle(currentTarget.value);
    onNoteChange(id, { id, title: currentTarget.value, text: noteText, creationDate: new Date() });
  }

  function handleNoteTextChange({ currentTarget }) {
    setNoteText(currentTarget.value);
    onNoteChange(id, { id, title: noteTitle, text: currentTarget.value, creationDate: new Date() });
  }

  return (
    <section className={styles.workspace}>
      {tranformedDate ? (
        <time className={styles.date} dateTime={tranformedDate}>
          {tranformedDate}
        </time>
      ) : (
        <div className={styles.datetimePlaceholder}></div>
      )}

      <textarea
        className={`${styles.textarea} ${styles.title}`}
        value={noteTitle}
        onChange={handleNoteTitleChange}
        placeholder="Type in note title..."
        readOnly={!editMode}
      />

      <textarea
        className={`${styles.textarea} ${styles.text}`}
        value={noteText}
        onChange={handleNoteTextChange}
        placeholder="Type in note text..."
        readOnly={!editMode}
      />

      {showEditBadge ? <ModeBadgeComponent editMode={editMode} /> : null}
      {showSavedBadge ? <SavedBadgeComponent position={savedBadgePosition} /> : null}
      {showBacklink ? <BacklinkComponent onClick={onBacklinkClick} /> : null}
    </section>
  );
}

/**
 * @param {{ editMode: boolean }} props
 * @returns JSX.Element
 */
function ModeBadge({ editMode, ...props }) {
  return (
    <strong
      className={`${styles.modeBadge} ${editMode ? styles.edit : styles.readonly}`}
      {...props}
    >
      {editMode ? 'Edit mode' : 'Read only mode'}
    </strong>
  );
}

/**
 * @param {{ position: 'left' | 'right'; [x: string]: unknown }} props
 * @returns JSX.Element
 */
function SavedBadge({ position = 'left', ...props }) {
  const positionClassName = position === 'left' ? styles.left : styles.right;

  return (
    <strong className={`${styles.autoSaveBadge} ${positionClassName}`} {...props}>
      &#10003; Saved...
    </strong>
  );
}

/**
 * @param {{ onClick: () => void; [x: string]: unknown }} props
 * @returns JSX.Element
 */
function Backlink({ onClick = () => {}, ...restProps }) {
  return (
    <button type="button" className={styles.backlink} onClick={onClick} {...restProps}>
      &#8617;
    </button>
  );
}
