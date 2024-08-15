const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const AuthType = new GraphQLObjectType({
    name: 'AuthType',
    fields: () => ({
        token: { type: GraphQLString },
        userId: { type: GraphQLString }
    })
});

module.exports = AuthType;