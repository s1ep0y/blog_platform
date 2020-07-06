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
import ArticleForm from './components/ArticleForm'
import Article from './components/Article'
import { connect } from 'react-redux';

function App(props) {
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
              <ArticleForm  key={uniqueId()}/>
            </Route>
            <Route path="/editarticle/:slug">
              <ArticleForm key={uniqueId()} />
            </Route>
            {props.articles.map((item)=> (
            <Route
            exact
              key={uniqueId()}
              path={'/articles/:slug'}
              children={(<Article />)}
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

const mapStateToProps = ({ articleReducers }) => {
  const { articles, allCount, loadedCount } = articleReducers.articlesState;
  return {
    articles, allCount, loadedCount
  }
};

export default connect(mapStateToProps)(App);
