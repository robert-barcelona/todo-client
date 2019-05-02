import React, {Component} from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

import '../main.scss'

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        username
      }
      token
    }
  }
`;


class Login extends Component {

  usernameRef = React.createRef()
  passwordRef = React.createRef()


  state = {
    username: '',
    password: '',
  }


  setUsername = e => {
    this.setState({username: e.target.value});
  }
  setPassword = e => {
    this.setState({password: e.target.value});
  }

  render() {
    const {props: {history}} = this
    const {state: {username, password}} = this

    return <Mutation mutation={LOGIN}

                     update={(cache,data)=>cache.writeData({data:{loggedIn:true}})}
                     onCompleted={data => {
      if (data && data.login) {
        const {login: {token}} = data
        if (token) {
          localStorage.setItem('token', token)
          history.push('/list')
        }
      }
    }}>
      {(register, {data, error, loading, client}) => {

        if (error) {
          return <div>{error.toString()}</div>
        }
        if (loading) return <div>Loading...</div>

        return (<form
          onSubmit={
            async e => {
              e.preventDefault()
              try {
                if (username && password) await register({variables: {username, password}})
              } catch (error) {
                console.log(error.message)
              }
              if (this.passwordRef.current) this.passwordRef.current.value = ''
              if (this.usernameRef.current) this.usernameRef.current.value = ''

            }
          }>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input ref={this.usernameRef} value={username} onChange={this.setUsername} className="input" type="email"
                     placeholder="Email"/>
              <span className="icon is-small is-left">
        <i className="fas fa-envelope"></i>
        </span>

            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input ref={this.passwordRef} value={password} onChange={this.setPassword} className="input"
                     type="password"
                     placeholder="Password"/>
              <span className="icon is-small is-left">
        <i className="fas fa-lock"></i>
        </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">
                Login
              </button>
            </p>
          </div>

        </form>)

      }}
    </Mutation>
  }

}


export default withRouter(Login)



