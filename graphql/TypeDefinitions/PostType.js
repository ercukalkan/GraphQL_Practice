const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        creator: { type: require('./UserType') },
        createdAt: { type: GraphQLFloat },
        updatedAt: { type: GraphQLFloat }
    })
});

module.exports = PostType;