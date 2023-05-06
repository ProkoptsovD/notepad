import { ReactComponent as LogoIcon } from './logo.svg';
import styles from './App.module.css';
import { ActionBox } from './components/actionBox';
import { Header } from './components/header';
import { SearchBox } from './components/searchBox';
import { Sidebar } from './components/sidebar';
import { Workspace } from './components/workspace';
import { datetimeService } from './services/datetimeService';
import { useNotesContext } from './contexts/NotesContext';

function App() {
  const { currentNote, createNote, getNoteById, deleteNote, notes, error } = useNotesContext();

  console.log('currentNote -->', currentNote);

  const ActionBoxComponent = () => (
    <ActionBox
      actionButtonsList={[
        { Icon: LogoIcon, onClick: createNote },
        { Icon: LogoIcon, onClick: deleteNote.bind(null, currentNote?.id) }
      ]}
    />
  );
  const SearchBoxComponent = () => <SearchBox onSearchChange={console.log} Icon={LogoIcon} />;

  return (
    <>
      <Header ActionBoxComponent={ActionBoxComponent} SearchBoxComponent={SearchBoxComponent} />
      <div className={styles.mainScreen}>
        <Sidebar
          itemsList={notes}
          onItemClick={getNoteById}
          activeItem={currentNote?.id}
          dateFormatFn={(date) =>
            datetimeService.format(date, { dateStyle: 'short', timeStyle: 'short' })
          }
        />
        <Workspace
          onNoteChange={() => {}}
          dateFormatFn={datetimeService.format.bind(datetimeService)}
        />

        {error ? <strong className={styles.error}>{error}</strong> : null}
      </div>
    </>
  );
}

export default App;
