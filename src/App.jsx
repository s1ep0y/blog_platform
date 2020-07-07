import React from 'react';
import { uniqueId } from 'lodash';
import './App.scss';
import '@csstools/normalize.css';
import "antd/dist/antd.css";
import { BrowserRouter as Router,   Switch,
  Route,
  } from 'react-router-dom';
import Home from './components/Home'
import Header from './components/Header'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ArticleFormWrapper from './components/ArticleFormWrapper'
import Article from './components/Article'

function App() {
  return (
    <div className="App">
      
      <Router>
      <Header />
        <div>
          <Switch>
            <Route path="/Login">
              <Login />
            </Route>
            <Route path="/addarticle">
              <ArticleFormWrapper  key={uniqueId()}/>
            </Route>
            <Route path="/editarticle/:slug">
              <ArticleFormWrapper key={uniqueId()} />
            </Route>
            <Route
            exact
              key={uniqueId()}
              path={'/articles/:slug'}
              children={(<Article />)}
            />
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
