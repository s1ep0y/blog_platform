import React from 'react';
import './App.scss';
import '@csstools/normalize.css';
import "antd/dist/antd.css";
import { BrowserRouter as Router,   Switch,
  Route,
  } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AddArticle from './components/AddArticle'

function App() {
  return (
    <div className="App">
    
      <Router>
        <div>
          <Switch>
            <Route path="/Login">
              <Login />
            </Route>
            <Route path="/addarticle">
              <AddArticle />
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
