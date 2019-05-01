import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'


const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      body
      title
      completed
    }
  }
`
const ADD_TODO = gql`
  mutation AddTodo($body:String!, $title:String!,$completed:Boolean = false) {
    addTodo(body:$body, title:$title, completed:$completed) {
      id
      body
      title
      completed
    }
  }
`

const SET_TODO_COMPLETE = gql`
  mutation SetTodoComplete($id:ID! , $completed:Boolean = true) {
    setTodoComplete(id:$id, completed:$completed) {
      id
      completed
      user {
        username
      }
    }
  }

`

const TodoItem = ({id, completed}) => {
  const checkboxToggle = (onToggle, id, newCompleted) => {
    console.log( id, newCompleted)
    onToggle({variables: {id, completed: newCompleted}})
  }

  return <Mutation mutation={SET_TODO_COMPLETE} variables={{id, completed}}  refetchQueries={() =>  [{
    query: GET_TODOS}]}
                   onError={(e) => console.log('error in TodoItem mutation', e)}>
    {(toggle, {data, error, loading}) => {
      return <label className="checkbox">
        <input type="checkbox" checked={completed} onChange={e => checkboxToggle(toggle, id, e.target.checked)}/>
        Completed
      </label>
    }

    }


  </Mutation>

}


class List extends Component {

  titleRef = React.createRef()
  bodyRef = React.createRef()


  state = {
    title: '',
    body: '',

  }

  setTitle = e => {
    this.setState({title: e.target.value});
  }
  setBody = e => {
    this.setState({body: e.target.value});
  }


  render() {

    const {state: {body, title}} = this

    return (
      <div className='columns'>
        <div className='column is-half'>

          <Mutation mutation={ADD_TODO}
                    refetchQueries={() => {
                      return [{
                        query: GET_TODOS
                      }];
                    }}
          >
            {(addTodo, {loading, error, data}) => {
              if (loading) return <div>Loading...</div>

              if (error) return <div className='message is-warning'>
                <div className="message-header">
                  {`${error.toString()}`}</div>
              </div>

              return (<form
                onSubmit={
                  async e => {
                    e.preventDefault()
                    try {
                      if (body && title) await addTodo({variables: {body, title}})
                    } catch (error) {
                      console.log(error.message)
                    }
                    if (this.titleRef.current) this.titleRef.current.value = ''
                    if (this.bodyRef.current) this.bodyRef.current.value = ''

                  }
                }>
                <div className="field">
                  <p className="control has-icons-left">
                    <input ref={this.titleRef} value={title} onChange={this.setTitle} className="input" type="text"
                           placeholder="Title"/>
                    <span className="icon is-small is-left">
        <i className="fas fa-pencil-alt"></i>
        </span>

                  </p>
                </div>
                <div className="field">
                  <p className="control has-icons-left">
                    <textarea ref={this.bodyRef} value={body} onChange={this.setBody} className="input"
                              className="textarea"
                              placeholder="Body"></textarea>
                    <span className="icon is-small is-left">
        <i className="fas fa-pencil-alt"></i>
        </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <button className="button is-success">
                      Add Todo
                    </button>
                  </p>
                </div>

              </form>)
            }
            }
          </Mutation>
        </div>
        <div className='column is-half'>

          <Query query={GET_TODOS}>
            {({loading, error, data}) => {
              if (loading) return <div>Loading...</div>

              if (error) return <div className='message is-warning'>
                <div className="message-header">
                  {`${error.toString()}`}</div>
              </div>

              if (!data || !data.getTodos || !data.getTodos.length) return <div>No Todos</div>
              return (
                <div>

                  <ul className='list'>
                    {data.getTodos.map(todo => <li className='jobListItem has-text-warning has-background-link'
                                                   key={todo.id}>Title: {todo.title},
                      Body: {todo.body}
                      Completed: {todo.completed ? 'true' : 'false'}
                      <TodoItem id={todo.id} completed={todo.completed}/>

                    </li>)}
                  </ul>
                </div>)
            }
            }
          </Query>
        </div>

      </div>
    )


  }


}


export default List
