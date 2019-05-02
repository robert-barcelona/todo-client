import React, {Component} from 'react';

import {Switch, Route,withRouter, NavLink, Redirect} from 'react-router-dom'
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



  render() {
    const {props: {history}} = this

    return <Query query={GET_LOGGED_IN}>
      {({loading, error, data, refetch}) => {

        const {loggedIn} = data

        return <div className="container">
          <header className="App-header">
            <div className='hero  has-background-warning has-text-link'>
            <i className="fas fa-th-list"></i>To Do!<i className="fas fa-check-circle"></i> </div>
            <nav className="navbar   has-background-warning has-text-link"   role="navigation" aria-label="main navigation">

              {!loggedIn && <NavLink className='navbar-item' to="/register">Register </NavLink>}
              {!loggedIn && <NavLink className='navbar-item' to="/login">Login </NavLink>}
              {loggedIn && <NavLink className='navbar-item' to="/list">Todos </NavLink>}
              {loggedIn && <ApolloConsumer>
                {(client) => (
                  <NavLink onClick={e => {
                    e.preventDefault();
                    history.push('/login')

                    client.clearStore() //<---  introduces bugs with router history!

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

export default withRouter(App);
