import './App.scss'
import { Switch, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import JellyGame from './JellyGame';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/play">
          <GamePage />
          {/* <JellyGame /> */}
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
