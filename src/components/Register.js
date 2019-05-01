import React, {Component} from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons'
import '../main.scss'

const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      id
      username
      password
    }
  }
`;


class Register extends Component {

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

    return <Mutation mutation={REGISTER}
                     onCompleted={(data) =>{
                       if (data && data.id) history.push('/login')}}>
      {(register, {data, error, loading}) => {
        if (error) {
          return <div>{error.toString()}</div>
        }
        if (loading) return <div>Loading...</div>
        return (<form
          onSubmit={
          async  e => {
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
                Register
              </button>
            </p>
          </div>

        </form>)

      }}
    </Mutation>
  }

}


export default Register



