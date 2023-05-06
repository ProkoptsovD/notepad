import { ReactComponent as LogoIcon } from './logo.svg';
import styles from './App.module.css';
import { ActionBox } from './components/actionBox';
import { Header } from './components/header';
import { SearchBox } from './components/searchBox';
import { Sidebar } from './components/sidebar';
import { Workspace } from './components/workspace';
import { datetimeService } from './services/datetimeService';

const id1 = crypto.randomUUID();
const id2 = crypto.randomUUID();

const ActionBoxComponent = () => (
  <ActionBox
    actionButtonsList={[
      { Icon: LogoIcon, onClick: () => console.log('click') },
      { Icon: LogoIcon, onClick: () => console.log('click') }
    ]}
  />
);
const SearchBoxComponent = () => <SearchBox onSearchChange={console.log} Icon={LogoIcon} />;

function App() {
  return (
    <>
      <Header ActionBoxComponent={ActionBoxComponent} SearchBoxComponent={SearchBoxComponent} />
      <div className={styles.mainScreen}>
        <Sidebar
          itemsList={[
            {
              creationDate: new Date(),
              title: 'My note',
              text: 'This is my first note ever',
              id: id1
            },
            {
              creationDate: new Date(),
              title: 'My note',
              text: 'This is my first note ever',
              id: id2
            }
          ]}
          onItemClick={(id) => console.log(id)}
          activeItem={id2}
        />
        <Workspace
          {...{
            creationDate: new Date(),
            title: 'My note',
            text: 'This is my first note ever',
            id: id1
          }}
          onNoteChange={console.log}
          dateFormatFn={datetimeService.format.bind(datetimeService)}
        />
      </div>
    </>
  );
}

export default App;
