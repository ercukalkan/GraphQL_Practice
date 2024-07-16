const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: GraphQLString },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        status: { type: GraphQLString },
        posts: { type: new GraphQLList(require('./PostType')) }
    })
});

module.exports = UserType;