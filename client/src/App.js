//import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client';



const query = gql`
query GetTodosWithUser{
  getTodos {
    title
    completed
    user {
      name
    }
  }
}

`

function App() {
  const {data,loading}= useQuery(query)

  if (loading){
    <div>Loading...</div>
  }


  return (
    <div className="App">
      <table>
        <tbody>
        {
          data.getTodos.map(todo => 
          <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.completed}</td>
            <td>{todo?.user?.name}</td>
          </tr>
          )
        }       
        </tbody>
      </table>
    </div>
  );
}

export default App;
