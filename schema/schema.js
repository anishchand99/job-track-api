const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    joined: { type: GraphQLString },
  }),
});

const AuthType = new GraphQLObjectType({
  name: 'auth',
  fields: () => ({
    auth_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    date_created: { type: GraphQLString },
  }),
});

const ListType = new GraphQLObjectType({
  name: 'list',
  fields: () => ({
    list_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    date_created: { type: GraphQLString },
  }),
});

const ApplicationType = new GraphQLObjectType({
  name: 'application',
  fields: () => ({
    app_id: { type: GraphQLString },
    dateapplied: { type: GraphQLString },
    companyname: { type: GraphQLString },
    location: { type: GraphQLSchema },
    url: { type: GraphQLString },
    jobdescription: { type: GraphQLString },
    specificrequirements: { type: GraphQLString },
    comments: { type: GraphQLString },
    accepted: { type: GraphQLBoolean },
    pending: { type: GraphQLBoolean },
    rejected: { type: GraphQLBoolean },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { email: { type: GraphQLString } },
      resolve(parent, args) {
        return {
          id: 1,
          name: 'Anish',
          email: 'achand@gmail.com',
          joined: '2020/02/19',
        };
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRecords: {
      type: ApplicationType,
      args: {
        row: { type: GraphQLList },
        listToDisplay: { type: GraphQLString },
      },
      resolve(parent, args) {},
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
