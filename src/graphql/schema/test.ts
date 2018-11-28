import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLSchema, GraphQLNonNull} from "graphql";
import axios from "axios";
import { CLOSING } from "ws";

const CompanyType: any = new GraphQLObjectType({
    name: 'Company',
    fields:() => ( {
        id: {type: GraphQLString},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        users: {type: new GraphQLList(UserType),
        resolve(parentValue, args) {
            return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
            .then(res => res.data)
        }}
    })
});
const UserType: any = new GraphQLObjectType({
    name: 'User',
    fields:() => ( {
        id: {type: GraphQLString},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString},
        age: {type: GraphQLInt},
        company: {type: CompanyType, resolve(parentValue, args){
            return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
            .then(res => res.data)
            // console.log(parentValue)
        }}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        user:{
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
return axios.get(`http://localhost:3000/users/${args.id}`)
.then(res => res.data)
            }
        },
        company:{
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
return axios.get(`http://localhost:3000/companies/${args.id}`)
.then(res => res.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields:{
        addUser:{
            type: UserType,
            args: {
            firstName: {type: new GraphQLNonNull(GraphQLString)},
            age: {type: new GraphQLNonNull( GraphQLInt)},
    companyId: {type: GraphQLString}},
            resolve(parentValue, {firstName, age}) {
return axios.post(`http://localhost:3000/users`, { firstName, age})
.then(res => res.data)
            }
        },
        deleteUser:{
            type: UserType,
            args: {
            id: {type: new GraphQLNonNull(GraphQLString)}},
            resolve(parentValue, args) {
return axios.delete(`http://localhost:3000/users/${args.id}`)
.then(res => res.data)
            }
        },
        editUser:{
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString},
                age: {type:  GraphQLInt},
        companyId: {type: GraphQLString}},
            resolve(parentValue, args) {
return axios.patch(`http://localhost:3000/users/${args.id}`, args)
.then(res => res.data)
            }
        }
    }
})
export = new GraphQLSchema({
    query: RootQuery,
    mutation
})

