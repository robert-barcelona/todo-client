import React, {Component} from 'react';

import {Switch, Route, NavLink, Redirect} from 'react-router-dom'
import {Query, Mutation, ApolloConsumer} from 'react-apollo'
import gql from 'graphql-tag'

import Login from './components/Login'
import List from './components/List'
import Register from './components/Register'


const GET_LOGGED_IN = gql`
  query GetLoggedIn {
    loggedIn @client
  }
`

class App extends Component {

  logout = e => {
    e.preventDefault()

    console.log('logout')
  }

  render() {
    return <Query query={GET_LOGGED_IN}>
      {({loading, error, data, refetch}) => {

        const {loggedIn} = data

        return <div className="container">
          <header className="App-header">
            <nav className="navbar" role="navigation" aria-label="main navigation">

              {!loggedIn && <NavLink className='navbar-item' to="/register">Register </NavLink>}
              {!loggedIn && <NavLink className='navbar-item' to="/login">Login </NavLink>}
              {loggedIn && <NavLink className='navbar-item' to="/list">Todos </NavLink>}
              {loggedIn && <ApolloConsumer>
                {(client) => (
                   <NavLink onClick={e => {
                    e.preventDefault();
                    // client.clearStore()

                     client.writeData({data: {loggedIn: false}})
                  }} className='navbar-item' to="#">Logout </NavLink>

                  )}
              </ApolloConsumer>}
            </nav>
          </header>

          <Switch>
            <Route
              exact
              path='/login'
              render={()=> !loggedIn ? <Login/> :  <Redirect to={{
                pathname: '/list',
              }}/>}
            />
            <Route
              exact
              path='/list'
              render={()=> loggedIn ? <List/> :  <Redirect to={{
                pathname: '/login',
              }}/>}
            />

            <Route
              exact
              path='/register'
              render={()=> !loggedIn ? <Register/> :  <Redirect to={{
                pathname: '/list',
              }}/>}
            />
          </Switch>
          <section>

          </section>
        </div>

      }}
    </Query>
  }
}

export default App;
