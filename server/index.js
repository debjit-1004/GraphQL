const { ApolloServer } = require('@apollo/server')
const {expressMiddleware} = require('@apollo/server/express4')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {default:axios} = require('axios')



async  function startServer() {
    const app = express()
    const server =  new ApolloServer({
        typeDefs: `
            type User{
                id:ID!
                name:String!
                username:String!
                email:String!
                phone:String!
                website:String!
                
            }

            type Todo{
                id:ID!
                title:String!
                completed: Boolean
                user:User
            }
            
            type Query {
                getTodos: [Todo!]!
                getAllUsers:[User!]!
                getUser(id:ID!): User
            }
        
        `,
        resolvers:{

            Todo: {
                user: async (todo) => {
                    try {
                        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`, {
                            timeout: 100000// 100 seconds
                        });
                        return response.data;
                    }
                    catch (error) {
                        console.error("Error fetching user data:", error.message);
                        return null;
                    }
                }
            }
            ,
            Query:{
                getTodos: async() => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data, 
                getAllUsers : async() => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async(parent,{id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data

            }
        }

    })

    app.use(cors())
    app.use(bodyParser.json())

    await  server.start()  

    app.use('/graphql', expressMiddleware(server))

    app.listen(8000, ()=> console.log('server running at port 8000'))
    
}


startServer()
