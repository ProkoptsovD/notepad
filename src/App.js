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
import { useState } from 'react';

function App() {
  const {
    currentNote,
    createNote,
    setSelectedNoteId,
    selectedNoteId,
    getNoteById,
    deleteNote,
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
        { Icon: TrashIcon, onClick: deleteButtonClickHandler, disabled: !selectedNoteId }
      ]}
    />
  );
  const SearchBoxComponent = () => <SearchBox onSearchChange={console.log} Icon={SearchIcon} />;

  function editButtonClickHandler() {
    getNoteById(selectedNoteId);
    setEditMode(true);
  }

  function deleteButtonClickHandler() {
    deleteNote(selectedNoteId);
    setEditMode(false);
  }

  function sidebarItemClickHandler(id) {
    setSelectedNoteId(id);
    setEditMode(false);
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
          onNoteChange={() => {}}
          dateFormatFn={(date) =>
            datetimeService.format(date, { dateStyle: 'full', timeStyle: 'medium' })
          }
          editMode={editMode}
          {...note}
        />

        {error ? <strong className={styles.error}>{error}</strong> : null}
      </div>
    </>
  );
}

export default App;
