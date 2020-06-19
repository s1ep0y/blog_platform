import React from 'react';
import { uniqueId } from 'lodash';
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
import { connect } from 'react-redux';

function App(props) {
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
            {props.articles.map((item)=> (
            <Route
            exact
              key={uniqueId()}
              path={'/articles/' + item.slug}
              children={(<div>{item.title}</div>)}
            />
          ))}
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

const mapStateToProps = ({ articlesList }) => {
  const { articles, allCount, loadedCount } = articlesList;
  return {
    articles, allCount, loadedCount
  }
};

export default connect(mapStateToProps)(App);
