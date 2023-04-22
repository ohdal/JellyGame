import './App.scss'
import { Switch, Route } from 'react-router-dom';
import { ModalContainer } from './containers/ModalContainer';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import MobilePage from './pages/MobilePage';


// mobile 기기 체크
function detectMobileDevice(agent) {
  const mobileRegex = [
    /Android/i,
    /iPhone/i,
    // /iPad/i,
    // /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ]
  return mobileRegex.some(mobile => agent.match(mobile));
}

const isMobile = detectMobileDevice(window.navigator.userAgent);

// 배포시 console.log & console.warn 지우기
if (process.env.NODE_ENV === "production") {
  console.log = function no_console() { };
  console.warn = function no_console() { };
}

function App() {
  return (
    <div className="App">
      {
        isMobile ?
          <MobilePage /> :
          <ModalContainer>
            <Switch>
              <Route exact path="/">
                <MainPage />
              </Route>
              <Route exact path="/play">
                <GamePage />
              </Route>
            </Switch>
          </ModalContainer>

      }
    </div>
  );
}

export default App;
