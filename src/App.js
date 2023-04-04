import './App.scss'
import { Switch, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/play">
          <GamePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
