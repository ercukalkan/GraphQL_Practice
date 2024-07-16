const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        creator: { type: require('./UserType') }
    })
});

module.exports = PostType;