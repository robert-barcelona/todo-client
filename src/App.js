import React from 'react';

import {Switch, Route, Link} from 'react-router-dom'


import Login from './components/Login'
import List from './components/List'
import Add from './components/Add'
import Register from './components/Register'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/register" >Register </Link>

      </header>

      <Switch>
          <Route
            exact
            path='/login'
            component={Login}
          />
          <Route
            exact
            path='/list'
            component={List}
          />
          <Route
            exact
            path='/add'
            component={Add}
          />
          <Route
          exact
          path='/register'
          component={Register}
        />
        </Switch>
      <section>

      </section>
    </div>
  );
}

export default App;
