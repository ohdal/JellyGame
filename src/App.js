import './App.scss'
import { Switch, Route } from 'react-router-dom';
import { ModalContainer } from './containers/ModalContainer';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <div className="App">
      <ModalContainer>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/play">
            <GamePage />
          </Route>
        </Switch>
      </ModalContainer>
    </div>
  );
}

export default App;
