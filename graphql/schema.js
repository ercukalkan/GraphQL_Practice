const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");

const schema = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello123: String
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)

module.exports = rootValue => {
    return createHandler({
        schema: schema,
        rootValue: rootValue,
        formatError(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'an error occured';
            const code = err.originalError.code || 500;
            return {
                message: message,
                status: code,
                data: data
            };
        }
    });
}