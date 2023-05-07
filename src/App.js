import { useCallback, useState } from 'react';
import { ReactComponent as PlusIcon } from './assets/plus.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as TrashIcon } from './assets/trash.svg';
import { ReactComponent as SearchIcon } from './assets/search.svg';

import { ActionBox } from './components/actionBox';
import { Header } from './components/header';
import { SearchBox } from './components/searchBox';
import { Sidebar } from './components/sidebar';
import { Workspace } from './components/workspace';
import { datetimeService } from './services/datetimeService';
import { useNotesContext } from './contexts/NotesContext';
import styles from './App.module.css';

function App() {
  const {
    currentNote,
    createNote,
    setSelectedNoteId,
    selectedNoteId,
    getNoteById,
    deleteNote,
    autoSaveNote,
    isNoteSaved,
    notes,
    error
  } = useNotesContext();
  const [editMode, setEditMode] = useState(false);
  const note = currentNote ?? {};

  const ActionBoxComponent = () => (
    <ActionBox
      actionButtonsList={[
        { Icon: PlusIcon, onClick: createNote },
        { Icon: EditIcon, onClick: editButtonClickHandler, disabled: !selectedNoteId },
        {
          Icon: TrashIcon,
          onClick: deleteButtonClickHandler.bind(null, selectedNoteId),
          disabled: !selectedNoteId
        }
      ]}
    />
  );
  const SearchBoxComponent = useCallback(
    () => <SearchBox onSearchChange={console.log} Icon={SearchIcon} />,
    []
  );

  const editButtonClickHandler = useCallback(() => {
    setEditMode(true);
  }, []);

  const deleteButtonClickHandler = useCallback(
    (id) => {
      deleteNote(id);
      setEditMode(false);
    },
    [deleteNote]
  );

  function sidebarItemClickHandler(id) {
    if (id !== selectedNoteId) {
      setSelectedNoteId(id);
      getNoteById(id);
    }

    if (editMode) setEditMode(false);
  }

  return (
    <>
      <Header ActionBoxComponent={ActionBoxComponent} SearchBoxComponent={SearchBoxComponent} />
      <div className={styles.mainScreen}>
        <Sidebar
          itemsList={notes}
          onItemClick={sidebarItemClickHandler}
          activeItem={selectedNoteId}
          dateFormatFn={(date) => datetimeService.format(date, { dateStyle: 'short' })}
        />
        <Workspace
          onNoteChange={autoSaveNote}
          editMode={editMode}
          isSaved={isNoteSaved}
          dateFormatFn={(date) =>
            datetimeService.format(date, { dateStyle: 'full', timeStyle: 'medium' })
          }
          {...note}
        />

        {error ? <strong className={styles.error}>{error}</strong> : null}
      </div>
    </>
  );
}

export default App;
