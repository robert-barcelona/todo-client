import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'



const GET_TODOS_FILTERED = gql`
  query GetTodosFiltered($showIncompleteOnly:Boolean! = false, $filterText:String) {
    getTodosFiltered(showIncompleteOnly:$showIncompleteOnly, filterText:$filterText) {
      id
      body
      title
      added
      completed
      user {
        username
      }
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

const DELETE_TODO = gql`
  mutation DeleteTodo($id:ID!) {
    deleteTodo(id:$id) {
      id
    }
  }

`


class List extends Component {

  titleRef = React.createRef()
  bodyRef = React.createRef()
  filterTextRef = React.createRef()


  state = {
    title: '',
    body: '',
    showIncompleteOnly: false,
    filterText: '',
  }

  checkboxToggle = (onToggle, id, newCompleted) => {
    const {state: {filterText}} = this
    onToggle({variables: {id, completed: newCompleted, filterText}})
  }

  setTitle = e => {
    this.setState({title: e.target.value});
  }
  setBody = e => {
    this.setState({body: e.target.value});
  }

  setFilterText = e => {
    this.setState({filterText: e.target.value})
  }

  completedFilterCheckbox = (e, refetch) => {
    const showIncompleteOnly = e.target.checked
    this.setState({showIncompleteOnly})
  }

  refetchAllFilteredTodos = () => {
    const {state: {showIncompleteOnly, filterText}} = this
    return [{
      query: GET_TODOS_FILTERED,
      variables: {showIncompleteOnly, filterText}
    }]
  }


  render() {

    const {state: {filterText, showIncompleteOnly, body, title}} = this

    return (
      <div className='columns'>

        <section className='column is-half'>

          <Mutation mutation={ADD_TODO}
                    refetchQueries={this.refetchAllFilteredTodos}
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
                    <textarea ref={this.bodyRef} value={body} onChange={this.setBody}
                              className="textarea"
                              placeholder="      Body"></textarea>
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
        </section>

        <section className='column is-half'>

          <Query query={GET_TODOS_FILTERED}

                 variables={{showIncompleteOnly, filterText}}
                 onCompleted={() => {
                   if (this.filterTextRef.current) this.filterTextRef.current.focus()
                 }}

          >
            {({loading, error, data, refetch}) => {
              if (loading) return <div>Loading...</div>

              if (error) return <div className='message is-warning'>
                <div className="message-header">
                  {`${error.toString()}`}</div>
              </div>

              return (
                <div>

                  <div className='columns'>
                    <div className='column is-one-third'>
                      <label className="checkbox">
                        Only show uncompleted todos:
                        <input type="checkbox" onChange={e => this.completedFilterCheckbox(e, refetch)}/>
                      </label></div>
                    <div className='column is-two-thirds'>
                      <label className="text">
                        Filter todos by:
                        <input ref={this.filterTextRef} autoFocus onChange={e => this.setFilterText(e)}
                               className="input is-info" type="text" placeholder="Text to filter by"
                               value={filterText}/>
                      </label>
                    </div>
                  </div>


                  {data && data.getTodosFiltered && <ul className='list'>
                    {data.getTodosFiltered.map(todo => <li className='todoListItem has-text-warning has-background-link'
                                                           key={todo.id}>
                      <p><strong>Title:</strong> {todo.title}</p>
                      <p><strong>Notes:</strong> {todo.body}</p>
                      <p><strong>Created:</strong> {todo.added}</p>
                      <p><strong>Created by:</strong> {todo.user.username}</p>
                      <Mutation mutation={SET_TODO_COMPLETE} variables={{id: todo.id, completed: todo.completed}}
                                refetchQueries={this.refetchAllFilteredTodos}

                                onError={(e) => console.log('error in TodoItem mutation', e)}>
                        {(toggle, {data, error, loading}) => {
                          return <label className="checkbox"> <p><strong>Completed:</strong>
                            <input type="checkbox" checked={todo.completed}
                                   onChange={e => this.checkboxToggle(toggle, todo.id, e.target.checked)}/>
                          </p>
                          </label>
                        }

                        }


                      </Mutation>
                      <Mutation mutation={DELETE_TODO}
                                refetchQueries={this.refetchAllFilteredTodos}
                      >
                        {(deleteTodo, {data, error}) => (
                          <a href='#' className='list-item' onClick={e => {
                            e.preventDefault();
                            deleteTodo({variables: {id: todo.id}})
                          }}>Delete: <i className="fas fa-trash-alt"></i></a>
                        )}

                      </Mutation>
                    </li>)}
                  </ul>}
                </div>)
            }
            }
          </Query>
        </section>

      </div>
    )


  }


}


export default List
