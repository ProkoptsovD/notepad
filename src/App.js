import { ReactComponent as LogoIcon } from './logo.svg';
import './App.css';
import { ActionBox } from './components/actionBox';
import { Header } from './components/header';
import { SearchBox } from './components/searchBox';

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
    <div className="App">
      <Header ActionBoxComponent={ActionBoxComponent} SearchBoxComponent={SearchBoxComponent} />
    </div>
  );
}

export default App;
