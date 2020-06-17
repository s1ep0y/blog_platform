import React from 'react';
import './App.scss';
import '@csstools/normalize.css';
import "antd/dist/antd.css";
import { BrowserRouter as Router,   Switch,
  Route,
  } from 'react-router-dom';
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

function App() {
  return (
    <div className="App">
    
      <Router>
        <div>
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>

            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/">
              <Home />
            </Route>
            
          </Switch>

        </div>
      </Router>
    </div>
  );
}

export default App;
